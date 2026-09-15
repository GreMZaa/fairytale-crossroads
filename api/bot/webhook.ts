/**
 * @file webhook.ts
 * @route POST /api/bot/webhook
 * @security Webhook для обработки апдейтов Telegram Bot в serverless среде Vercel
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpdate } from '../../bot/index';

export async function handleBotWebhook(body: any, secretHeader?: string) {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const secret = req.headers['x-telegram-bot-api-secret-token'] as string;
  const result = await handleBotWebhook(req.body, secret);
  return res.status(result.status).json(result.body);
}
