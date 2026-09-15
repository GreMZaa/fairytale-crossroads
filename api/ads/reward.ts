/**
 * @file reward.ts
 * @route POST /api/ads/reward
 * @security Безопасное начисление +2 💎 после просмотра рекламы
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateTelegramInitData } from '../auth/validate.js';
import { UserService } from '../lib/userService.js';

interface AdRewardRequestBody {
  initData?: string;
  telegram_id?: number;
  ad_type?: string;
}

export async function handleAdReward(body: AdRewardRequestBody, botToken?: string) {
  let authenticatedTelegramId: number | null = null;

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

  try {
    const rewardAmount = 2;
    const result = await UserService.rewardAdView(authenticatedTelegramId, rewardAmount);

    return {
      status: 200,
      body: {
        success: true,
        reward_crystals: rewardAmount,
        new_balance: result.newBalance
      }
    };
  } catch {
    return {
      status: 500,
      body: { success: false, error: 'Failed to credit ad reward' }
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const result = await handleAdReward(req.body || {}, botToken);
  return res.status(result.status).json(result.body);
}
