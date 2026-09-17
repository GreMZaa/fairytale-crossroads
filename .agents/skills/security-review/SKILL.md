---
name: security-review
description: "Use when performing automated security reviews, threat modeling, and vulnerability scans on API endpoints, Telegram Mini Apps, authentication, and database RLS before deploying."
metadata:
  category: security
  triggers: security-review, security audit, поиск уязвимостей, проверка безопасности, hmac, idor, rls audit
---

# 🛡️ Security Review (Zero-Trust Pre-Launch Audit)

Автономный аудит безопасности до деплоя в production. Специализирован под стек Telegram Mini App + Serverless + Supabase.

## 🎯 Ключевые векторы проверки (Must-Check Checklist)

### 1. Telegram Mini App Authentication (`initData`)
- [ ] **HMAC-SHA256:** Сервер обязан валидировать подпись `initData` через секретный ключ, вычисленный от `bot_token`.
- [ ] **Data Freshness:** Проверка поля `auth_date` (отсекать запросы старше 24 часов для защиты от Replay-атак).
- [ ] **Никакого доверия заголовкам клиента:** `telegram_id` извлекается **строго** из расшифрованного и проверенного `initData`, а не из `headers` или тела JSON.

### 2. Защита от IDOR / BOLA (Broken Object Level Authorization)
- [ ] Каждая операция чтения/записи в Supabase принудительно проверяет принадлежность ресурса текущему пользователю (`WHERE user_id = auth.uid()` или `telegram_id = validated_id`).
- [ ] Принцип `deny-by-default` в RLS: запретить анонимный доступ ко всем таблицам прогресса, инвентаря и статистики.

### 3. Mass Assignment & Data Poisoning
- [ ] Запретить прямое обновление полей баланса (`crystals`, `keys`, `is_admin`) через эндпоинты сохранения прогресса или профиля.
- [ ] Все изменения экономики происходят **только** через изолированные серверные RPC-функции или транзакции после проверки событий (просмотр рекламы, оплата через ЮKassa).

### 4. Платежи и Webhook Security (ЮKassa / Telegram / Ads)
- [ ] Проверка IP-адресов или криптографической подписи вебхуков ЮKassa / провайдера рекламы.
- [ ] Защита от повторной обработки (идемпотентность по `payment_id` / `transaction_id`).

### 5. Защита от утечек информации (Info Leakage)
- [ ] Никогда не возвращать клиенту stack trace, SQL-ошибки или внутренние структуры БД.
- [ ] Использовать строгие DTO (Data Transfer Objects) через Zod для валидации входов и фильтрации выходов.
- [ ] Отсутствие переменных окружения (`SUPABASE_SERVICE_ROLE_KEY`, `BOT_TOKEN`) в клиентском бандле.
