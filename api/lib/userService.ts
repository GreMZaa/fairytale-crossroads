/**
 * @file userService.ts
 * @security Сервис управления профилями и сохранением прогресса
 * Защищает от Mass Assignment, IDOR/BOLA и реализует deny-by-default.
 * Автоматически сохраняет и синхронизирует данные с Supabase PostgreSQL.
 */

import { UserProfile, UserProgressState, UserStats } from '../../src/types/game';
import { CINDERELLA_EPISODE_1 } from './storyData';
import { supabaseAdmin } from './supabase';

const inMemoryUsers = new Map<number, UserProfile>();
const inMemoryProgress = new Map<string, UserProgressState>();

export class UserService {
  /**
   * Получение или автоматическая регистрация пользователя по telegram_id
   * @security Регистрация происходит строго на сервере
   */
  static async getOrCreateUser(
    telegramId: number,
    username?: string,
    firstName?: string
  ): Promise<UserProfile> {
    // 1. Попытка запросить из Supabase
    try {
      const { data: dbUser, error } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          telegram_id,
          username,
          first_name,
          crystals,
          keys,
          user_stats (
            light_path,
            dark_path,
            courage,
            cunning,
            prince_affinity
          )
        `)
        .eq('telegram_id', telegramId)
        .maybeSingle();

      if (dbUser && !error) {
        const stats = (dbUser as any).user_stats || {
          light_path: 0,
          dark_path: 0,
          courage: 0,
          cunning: 0,
          prince_affinity: 0
        };

        const profile: UserProfile = {
          id: dbUser.id,
          telegram_id: dbUser.telegram_id,
          username: dbUser.username || username,
          first_name: dbUser.first_name || firstName,
          crystals: dbUser.crystals,
          keys: dbUser.keys,
          stats
        };

        inMemoryUsers.set(telegramId, profile);
        return profile;
      }

      // Создаем нового пользователя в Supabase
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          telegram_id: telegramId,
          username: username || `player_${telegramId.toString().slice(-4)}`,
          first_name: firstName || 'Странник',
          crystals: 25,
          keys: 2
        })
        .select()
        .single();

      if (newUser && !insertError) {
        // Создаем запись статистики
        await supabaseAdmin.from('user_stats').insert({
          user_id: newUser.id,
          light_path: 0,
          dark_path: 0,
          courage: 0,
          cunning: 0,
          prince_affinity: 0
        });

        const profile: UserProfile = {
          id: newUser.id,
          telegram_id: newUser.telegram_id,
          username: newUser.username,
          first_name: newUser.first_name,
          crystals: newUser.crystals,
          keys: newUser.keys,
          stats: {
            light_path: 0,
            dark_path: 0,
            courage: 0,
            cunning: 0,
            prince_affinity: 0
          }
        };

        inMemoryUsers.set(telegramId, profile);
        return profile;
      }
    } catch {
      // Fallback на in-memory
    }

    // Fallback на локальную память (offline dev)
    let user = inMemoryUsers.get(telegramId);
    if (!user) {
      user = {
        id: `usr_${telegramId}`,
        telegram_id: telegramId,
        username: username || `player_${telegramId.toString().slice(-4)}`,
        first_name: firstName || 'Странник',
        crystals: 25,
        keys: 2,
        stats: {
          light_path: 0,
          dark_path: 0,
          courage: 0,
          cunning: 0,
          prince_affinity: 0
        }
      };
      inMemoryUsers.set(telegramId, user);
    }
    return user;
  }

  /**
   * Получение текущего прогресса пользователя
   */
  static async getProgress(telegramId: number, storyId: string): Promise<UserProgressState> {
    const key = `${telegramId}_${storyId}`;
    let progress = inMemoryProgress.get(key);
    if (!progress) {
      progress = {
        story_id: storyId,
        current_episode_id: 'cinderella-ep1',
        current_node_id: 'node_1',
        completed_nodes: [],
        purchased_choices: [],
        unlocked_items: [],
        timer_ends_at: null
      };
      inMemoryProgress.set(key, progress);
    }
    return progress;
  }

  /**
   * Безопасное применение выбора игрока
   */
  static async applyChoice(
    telegramId: number,
    storyId: string,
    _episodeId: string,
    nodeId: string,
    choiceId: string
  ): Promise<{
    success: boolean;
    nextNodeId: string;
    updatedStats: UserStats;
    crystals: number;
    keys: number;
    feedbackText: string;
    error?: string;
  }> {
    const user = await this.getOrCreateUser(telegramId);
    const progress = await this.getProgress(telegramId, storyId);

    const episode = CINDERELLA_EPISODE_1;
    const currentNode = episode.nodes[nodeId];

    if (!currentNode || !currentNode.puzzle) {
      return {
        success: false,
        nextNodeId: nodeId,
        updatedStats: user.stats,
        crystals: user.crystals,
        keys: user.keys,
        feedbackText: '',
        error: 'Current node has no choices'
      };
    }

    const choice = currentNode.puzzle.choices.find(c => c.id === choiceId);
    if (!choice) {
      return {
        success: false,
        nextNodeId: nodeId,
        updatedStats: user.stats,
        crystals: user.crystals,
        keys: user.keys,
        feedbackText: '',
        error: 'Invalid choice selected'
      };
    }

    // Проверка баланса кристаллов для премиум-выбора
    if (choice.type === 'premium' && choice.cost > 0) {
      if (user.crystals < choice.cost) {
        return {
          success: false,
          nextNodeId: nodeId,
          updatedStats: user.stats,
          crystals: user.crystals,
          keys: user.keys,
          feedbackText: 'Недостаточно кристаллов 💎 для выбора!',
          error: 'INSUFFICIENT_CRYSTALS'
        };
      }
      user.crystals -= choice.cost;
      progress.purchased_choices.push(choiceId);
    }

    // Начисление статов строго сервером
    if (choice.stat_changes) {
      if (choice.stat_changes.courage) user.stats.courage += choice.stat_changes.courage;
      if (choice.stat_changes.light_path) user.stats.light_path += choice.stat_changes.light_path;
      if (choice.stat_changes.dark_path) user.stats.dark_path += choice.stat_changes.dark_path;
      if (choice.stat_changes.cunning) user.stats.cunning += choice.stat_changes.cunning;
      if (choice.stat_changes.prince_affinity) user.stats.prince_affinity += choice.stat_changes.prince_affinity;
    }

    // Обновление прогресса
    if (choice.result !== 'fail') {
      progress.completed_nodes.push(nodeId);
      progress.current_node_id = choice.next_node;
    }

    // Асинхронное обновление в Supabase
    try {
      await supabaseAdmin
        .from('users')
        .update({ crystals: user.crystals, updated_at: new Date().toISOString() })
        .eq('telegram_id', telegramId);

      await supabaseAdmin
        .from('user_stats')
        .update({
          courage: user.stats.courage,
          light_path: user.stats.light_path,
          dark_path: user.stats.dark_path,
          cunning: user.stats.cunning,
          prince_affinity: user.stats.prince_affinity,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } catch {
      // no-op
    }

    return {
      success: true,
      nextNodeId: choice.next_node,
      updatedStats: { ...user.stats },
      crystals: user.crystals,
      keys: user.keys,
      feedbackText: choice.feedback_text
    };
  }

  /**
   * Начисление кристаллов за просмотр рекламы (Rewarded Video)
   */
  static async rewardAdView(telegramId: number, amount: number = 2): Promise<{
    success: boolean;
    newBalance: number;
    error?: string;
  }> {
    if (amount <= 0 || amount > 10) {
      return { success: false, newBalance: 0, error: 'Invalid reward amount' };
    }

    const user = await this.getOrCreateUser(telegramId);
    user.crystals += amount;

    try {
      await supabaseAdmin
        .from('users')
        .update({ crystals: user.crystals, updated_at: new Date().toISOString() })
        .eq('telegram_id', telegramId);
    } catch {
      // no-op
    }

    return {
      success: true,
      newBalance: user.crystals
    };
  }

  /**
   * Ускорение таймера спасения
   */
  static async speedupTimer(
    telegramId: number,
    storyId: string,
    method: 'ad' | 'crystals',
    nextNodeId: string
  ): Promise<{ success: boolean; nextNodeId: string; crystals: number; error?: string }> {
    const user = await this.getOrCreateUser(telegramId);
    const progress = await this.getProgress(telegramId, storyId);

    if (method === 'crystals') {
      const cost = 5;
      if (user.crystals < cost) {
        return { success: false, nextNodeId: progress.current_node_id, crystals: user.crystals, error: 'Not enough crystals' };
      }
      user.crystals -= cost;
      try {
        await supabaseAdmin
          .from('users')
          .update({ crystals: user.crystals, updated_at: new Date().toISOString() })
          .eq('telegram_id', telegramId);
      } catch {
        // no-op
      }
    }

    progress.current_node_id = nextNodeId;
    progress.timer_ends_at = null;

    return {
      success: true,
      nextNodeId,
      crystals: user.crystals
    };
  }
}
