/**
 * @file save.ts
 * @route POST /api/progress/save
 * @security Защита от Mass Assignment, IDOR/BOLA и проверка HMAC Telegram initData
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateTelegramInitData } from '../auth/validate.js';
import { UserService } from '../lib/userService.js';

interface SaveRequestBody {
  initData?: string;
  telegram_id?: number;
  story_id: string;
  episode_id: string;
  node_id: string;
  choice_id: string;
}

export async function handleSaveProgress(body: SaveRequestBody, botToken?: string) {
  let authenticatedTelegramId: number | null = null;

  // 1. Проверка Telegram initData через HMAC-SHA256 подпись
  if (body.initData && botToken) {
    const authResult = validateTelegramInitData(body.initData, botToken);
    if (!authResult.isValid || !authResult.user) {
      return {
        status: 401,
        body: { success: false, error: 'Unauthorized: Invalid Telegram signature' }
      };
    }
    authenticatedTelegramId = authResult.user.id;
  } else if (process.env.NODE_ENV !== 'production' && body.telegram_id) {
    authenticatedTelegramId = Number(body.telegram_id);
  }

  if (!authenticatedTelegramId) {
    return {
      status: 401,
      body: { success: false, error: 'Authentication required' }
    };
  }

  // 2. Валидация входных параметров
  const { story_id, episode_id, node_id, choice_id } = body;
  if (!story_id || !episode_id || !node_id || !choice_id) {
    return {
      status: 400,
      body: { success: false, error: 'Missing required story parameters' }
    };
  }

  try {
    const result = await UserService.applyChoice(
      authenticatedTelegramId,
      story_id,
      episode_id,
      node_id,
      choice_id
    );

    return {
      status: 200,
      body: result
    };
  } catch {
    return {
      status: 500,
      body: { success: false, error: 'Failed to process progress save' }
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const result = await handleSaveProgress(req.body || {}, botToken);
  return res.status(result.status).json(result.body);
}
