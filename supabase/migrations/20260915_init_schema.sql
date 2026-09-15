-- ====================================================================
-- Сказки: Перекрестки Судеб (Fairy Tale Crossroads)
-- Initial Database Schema Migration: PostgreSQL / Supabase
-- ====================================================================

-- 1. ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ (users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    crystals INTEGER NOT NULL DEFAULT 20 CHECK (crystals >= 0),
    keys INTEGER NOT NULL DEFAULT 2 CHECK (keys >= 0 AND keys <= 5),
    energy_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индекс для быстрого поиска по telegram_id
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);

-- 2. ТАБЛИЦА СТАТИСТИКИ И ПУТЕЙ (user_stats)
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    light_path INTEGER NOT NULL DEFAULT 0,
    dark_path INTEGER NOT NULL DEFAULT 0,
    courage INTEGER NOT NULL DEFAULT 0,
    cunning INTEGER NOT NULL DEFAULT 0,
    prince_affinity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ТАБЛИЦА ИСТОРИЙ (stories)
CREATE TABLE IF NOT EXISTS public.stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    tag TEXT DEFAULT 'Романтика & Сказка',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ТАБЛИЦА ЭПИЗОДОВ / ГЛАВ (episodes)
CREATE TABLE IF NOT EXISTS public.episodes (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    initial_node_id TEXT NOT NULL,
    nodes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_episodes_story_id ON public.episodes(story_id);

-- 5. ТАБЛИЦА ПРОГРЕССА ИГРОКА (user_progress)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    story_id TEXT NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    current_episode_id TEXT NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
    current_node_id TEXT NOT NULL,
    completed_nodes TEXT[] NOT NULL DEFAULT '{}',
    purchased_choices TEXT[] NOT NULL DEFAULT '{}',
    unlocked_items TEXT[] NOT NULL DEFAULT '{}',
    timer_ends_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_story_unique UNIQUE (user_id, story_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);

-- ====================================================================
-- БЕЗОПАСНОСТЬ: ROW LEVEL SECURITY (RLS) - DENY BY DEFAULT
-- ====================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 1) Истории и эпизоды доступны для публичного чтения активных историй
CREATE POLICY "Public can read active stories"
    ON public.stories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public can read episodes of active stories"
    ON public.episodes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.stories s
        WHERE s.id = episodes.story_id AND s.is_active = true
    ));

-- 2) Пользователи видят только свои данные по JWT telegram_id
CREATE POLICY "Users can select own record"
    ON public.users FOR SELECT
    USING (
        telegram_id = ((current_setting('request.jwt.claims', true)::jsonb ->> 'telegram_id')::bigint)
    );

CREATE POLICY "Users can select own stats"
    ON public.user_stats FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM public.users
            WHERE telegram_id = ((current_setting('request.jwt.claims', true)::jsonb ->> 'telegram_id')::bigint)
        )
    );

CREATE POLICY "Users can select own progress"
    ON public.user_progress FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM public.users
            WHERE telegram_id = ((current_setting('request.jwt.claims', true)::jsonb ->> 'telegram_id')::bigint)
        )
    );

-- 3) Запрет прямого INSERT/UPDATE/DELETE от клиентов без сервисной валидации
-- Все мутации баланса и прогресса производятся через Serverless API / RPC функции (SECURITY DEFINER)
-- для исключения Mass Assignment, IDOR и подделки валюты

-- ====================================================================
-- ЗАЩИЩЕННЫЕ СЕРВЕРНЫЕ ФУНКЦИИ (SECURITY DEFINER)
-- ====================================================================

-- Функция восстановления энергии: 1 ключ каждые 3 часа (макс 2)
CREATE OR REPLACE FUNCTION public.regenerate_energy(p_telegram_id BIGINT)
RETURNS TABLE (new_keys INTEGER, next_energy_in_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_current_keys INTEGER;
    v_last_updated TIMESTAMPTZ;
    v_hours_passed NUMERIC;
    v_keys_to_add INTEGER;
    v_max_keys CONSTANT INTEGER := 2;
    v_regen_hours CONSTANT INTEGER := 3;
    v_remainder_seconds INTEGER;
BEGIN
    SELECT id, keys, energy_updated_at
    INTO v_user_id, v_current_keys, v_last_updated
    FROM public.users
    WHERE telegram_id = p_telegram_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF v_current_keys >= v_max_keys THEN
        RETURN QUERY SELECT v_current_keys, 0;
        RETURN;
    END IF;

    v_hours_passed := EXTRACT(EPOCH FROM (now() - v_last_updated)) / 3600.0;
    v_keys_to_add := FLOOR(v_hours_passed / v_regen_hours)::INTEGER;

    IF v_keys_to_add > 0 THEN
        v_current_keys := LEAST(v_max_keys, v_current_keys + v_keys_to_add);
        UPDATE public.users
        SET keys = v_current_keys,
            energy_updated_at = v_last_updated + (v_keys_to_add * v_regen_hours * INTERVAL '1 hour'),
            updated_at = now()
        WHERE id = v_user_id;
    END IF;

    IF v_current_keys < v_max_keys THEN
        v_remainder_seconds := (v_regen_hours * 3600) - (EXTRACT(EPOCH FROM (now() - v_last_updated))::INTEGER % (v_regen_hours * 3600));
    ELSE
        v_remainder_seconds := 0;
    END IF;

    RETURN QUERY SELECT v_current_keys, v_remainder_seconds;
END;
$$;

-- Безопасное начисление награды за просмотр рекламы (+2 кристалла)
CREATE OR REPLACE FUNCTION public.claim_rewarded_ad(p_telegram_id BIGINT, p_reward_crystals INTEGER DEFAULT 2)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_balance INTEGER;
BEGIN
    IF p_reward_crystals <= 0 OR p_reward_crystals > 10 THEN
        RAISE EXCEPTION 'Invalid reward amount';
    END IF;

    UPDATE public.users
    SET crystals = crystals + p_reward_crystals,
        updated_at = now()
    WHERE telegram_id = p_telegram_id
    RETURNING crystals INTO v_new_balance;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    RETURN v_new_balance;
END;
$$;
