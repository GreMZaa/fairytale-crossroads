/**
 * @file webhook.ts
 * @route POST /api/bot/webhook
 * @security Webhook для обработки апдейтов Telegram Bot в serverless среде Vercel
 */

import { handleUpdate } from '../../bot/index';

export async function handleBotWebhook(body: any, secretHeader?: string) {
  // Проверка секретного токена вебхука (X-Telegram-Bot-Api-Secret-Token)
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && secretHeader !== expectedSecret) {
    return {
      status: 403,
      body: { error: 'Forbidden' }
    };
  }

  try {
    if (body && body.update_id) {
      await handleUpdate(body);
    }
    return {
      status: 200,
      body: { ok: true }
    };
  } catch {
    return {
      status: 500,
      body: { error: 'Internal Server Error' }
    };
  }
}
