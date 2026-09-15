/**
 * @file validate.ts
 * @security Криптографическая валидация Telegram initData через HMAC-SHA256
 * Соответствует строгим требованиям безопасности Telegram WebApp и Security Audit Guidelines.
 */

import crypto from 'crypto';

export interface ValidatedTelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  user: ValidatedTelegramUser | null;
  authDate: number | null;
  error?: string;
}

/**
 * Валидирует строку initData от Telegram Mini App
 * @security Защита от подмены telegram_id и Replay-атак
 * @param initData Сырая строка window.Telegram.WebApp.initData
 * @param botToken Токен телеграм-бота из ENV (TELEGRAM_BOT_TOKEN)
 * @param maxAgeSeconds Максимальный возраст подписи (по умолчанию 86400 сек / 24 часа)
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds: number = 86400
): ValidationResult {
  if (!initData || !botToken) {
    return {
      isValid: false,
      user: null,
      authDate: null,
      error: 'Missing initData or bot token'
    };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');

    if (!hash) {
      return {
        isValid: false,
        user: null,
        authDate: null,
        error: 'Missing hash parameter'
      };
    }

    // Удаляем hash для создания data-check-string
    params.delete('hash');

    // Сортируем ключи в алфавитном порядке
    const items: string[] = [];
    params.forEach((value, key) => {
      items.push(`${key}=${value}`);
    });
    items.sort();
    const dataCheckString = items.join('\n');

    // Шаг 1: Секретный ключ = HMAC_SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Шаг 2: Вычисляем хеш от dataCheckString
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Шаг 3: Безопасное сравнение постоянного времени (timing safe)
    const hashBuffer = Buffer.from(hash, 'hex');
    const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

    if (hashBuffer.length !== calculatedBuffer.length || !crypto.timingSafeEqual(hashBuffer, calculatedBuffer)) {
      return {
        isValid: false,
        user: null,
        authDate: null,
        error: 'Invalid HMAC signature'
      };
    }

    // Шаг 4: Проверка времени auth_date
    const authDateStr = params.get('auth_date');
    const authDate = authDateStr ? parseInt(authDateStr, 10) : 0;
    const now = Math.floor(Date.now() / 1000);

    if (authDate <= 0 || (now - authDate) > maxAgeSeconds) {
      return {
        isValid: false,
        user: null,
        authDate,
        error: 'Signature expired (replay attack protection)'
      };
    }

    // Шаг 5: Извлекаем пользователя
    const userStr = params.get('user');
    let user: ValidatedTelegramUser | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        return {
          isValid: false,
          user: null,
          authDate,
          error: 'Malformed user payload'
        };
      }
    }

    if (!user || typeof user.id !== 'number') {
      return {
        isValid: false,
        user: null,
        authDate,
        error: 'Missing valid user ID in payload'
      };
    }

    return {
      isValid: true,
      user,
      authDate
    };
  } catch {
    // Безопасный возврат без утечки стектрейса
    return {
      isValid: false,
      user: null,
      authDate: null,
      error: 'Authentication failed'
    };
  }
}
