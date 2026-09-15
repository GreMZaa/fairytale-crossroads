/**
 * @file index.ts
 * @route POST /api/profile
 * Получение профиля игрока (баланс кристаллов, ключей, статистика)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateTelegramInitData } from '../auth/validate';
import { UserService } from '../lib/userService';

export async function handleGetProfile(body: { initData?: string; telegram_id?: number }, botToken?: string) {
  let authenticatedTelegramId: number | null = null;
  let username: string | undefined;
  let firstName: string | undefined;

  if (body.initData && botToken) {
    const authResult = validateTelegramInitData(body.initData, botToken);
    if (!authResult.isValid || !authResult.user) {
      return {
        status: 401,
        body: { success: false, error: 'Unauthorized: Invalid Telegram signature' }
      };
    }
    authenticatedTelegramId = authResult.user.id;
    username = authResult.user.username;
    firstName = authResult.user.first_name;
  } else if (process.env.NODE_ENV !== 'production' && body.telegram_id) {
    authenticatedTelegramId = Number(body.telegram_id);
  }

  if (!authenticatedTelegramId) {
    return {
      status: 401,
      body: { success: false, error: 'Authentication required' }
    };
  }

  try {
    const user = await UserService.getOrCreateUser(authenticatedTelegramId, username, firstName);
    return {
      status: 200,
      body: {
        success: true,
        user
      }
    };
  } catch {
    return {
      status: 500,
      body: { success: false, error: 'Failed to fetch user profile' }
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const result = await handleGetProfile(req.body || {}, botToken);
  return res.status(result.status).json(result.body);
}
