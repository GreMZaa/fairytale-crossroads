---
name: yukassa-payments
description: "Use when integrating Russian payment gateway YooKassa (ЮKassa) for Telegram Mini Apps and bots, handling SBP (Fast Payments System), receipts 54-FZ, webhooks, and currency crediting."
metadata:
  category: payments
  triggers: yukassa, юкасса, сбп, оплата, 54-фз, покупка кристаллов, платежный шлюз
---

# 💳 ЮKassa Integration (Payments & Subscriptions)

Интеграция платежной системы **ЮKassa** для приема платежей в РФ внутри Telegram Mini App и бота: банковские карты, СБП, автоматическая фискализация (чеки 54-ФЗ), вебхуки и безопасное начисление игровых кристаллов/подписок.

## ⚙️ Архитектура платежного флоу

1. **Инициация (Клиент TMA):** Игрок выбирает пак кристаллов (например, "100 💎 за 199 ₽") → отправляет запрос на сервер `/api/payments/create`.
2. **Создание платежа (Serverless):**
   - Сервер формирует запрос в API ЮKassa (`https://api.yookassa.ru/v3/payments`) с ключом идемпотентности.
   - Включает фискальные данные чека (54-ФЗ): ИНН, СНО, предмет расчета, НДС.
   - Получает `confirmation_url` и возвращает его клиенту.
3. **Оплата:** TMA открывает платежный экран (СБП или ввод карты).
4. **Вебхук подтверждения (`/api/payments/webhook`):**
   - Проверка белого списка IP-адресов ЮKassa.
   - Парсинг события `payment.succeeded`.
   - Идемпотентное начисление кристаллов пользователю в Supabase внутри транзакции.
   - Отправка квитанции игроку через Telegram Bot API.

## 🔒 Безопасность платежей
- Запрет начисления валюты на клиенте.
- Проверка статуса платежа через прямой GET-запрос в ЮKassa перед зачислением (защита от фейковых вебхуков).
