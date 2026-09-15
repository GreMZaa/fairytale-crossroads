/**
 * @file index.ts
 * @security Telegram Bot для интерактивной новеллы «Сказки: Перекрестки Судеб»
 * Поддерживает режим Long Polling для локального запуска и Webhook для Vercel.
 */

import 'dotenv/config';
import { UserService } from '../api/lib/userService';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'DEMO_BOT_TOKEN';
const WEBAPP_URL = process.env.VITE_WEBAPP_URL || 'http://localhost:3000';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
  };
}

/**
 * Отправка сообщения с кнопкой запуска Telegram Mini App
 */
export async function sendStartMessage(chatId: number, userFirstName: string) {
  const text = 
    `✨ *Добро пожаловать в «Сказки: Перекрестки Судеб»!* ✨\n\n` +
    `Привет, ${userFirstName}! Тебя ждут интерактивные сказочные истории, где каждое твое решение меняет канон.\n\n` +
    `📖 *Эпизод 1: Золушка — «Ледяная Башня»*\n` +
    `Злая мачеха заперла Золушку в замерзающей башне прямо перед королевским балом. Решай головоломки, выбирай предметы и спаси героиню!\n\n` +
    `🎁 *Твой стартовый бонус:* 💎 25 Кристаллов и 🔑 2 Ключа энергии!\n\n` +
    `Нажми кнопку ниже, чтобы открыть новеллу прямо в Telegram:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🎮 Играть в «Сказки» (Mini App)',
          web_app: { url: WEBAPP_URL }
        }
      ],
      [
        {
          text: '💎 Получить бонусные кристаллы',
          callback_data: 'bonus_info'
        }
      ]
    ]
  };

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      })
    });
    return await res.json();
  } catch (err) {
    console.error('[Bot] Failed to send start message:', err);
    return null;
  }
}

/**
 * Обработка одного входящего Update (для webhook и long-polling)
 */
export async function handleUpdate(update: TelegramUpdate) {
  const msg = update.message;
  if (!msg || !msg.text) return;

  const from = msg.from;
  if (!from) return;

  if (msg.text.startsWith('/start')) {
    console.log(`[Bot] /start received from user ${from.id} (${from.username || from.first_name})`);

    // Серверная регистрация пользователя и начисление бонуса
    await UserService.getOrCreateUser(from.id, from.username, from.first_name);

    // Отправка приветствия и кнопки запуска TMA
    await sendStartMessage(msg.chat.id, from.first_name || 'Герой');
  }
}

/**
 * Запуск в режиме Long Polling для локальной разработки (npm run bot)
 */
async function startLongPolling() {
  if (BOT_TOKEN === 'DEMO_BOT_TOKEN') {
    console.log('----------------------------------------------------');
    console.log('⚠️ TELEGRAM_BOT_TOKEN не задан в .env файле.');
    console.log('Бот запущен в эмуляционном режиме для локальной разработки.');
    console.log(`Ссылка на Telegram Mini App: ${WEBAPP_URL}`);
    console.log('----------------------------------------------------');
    return;
  }

  console.log('🚀 Бот «Сказки: Перекрестки Судеб» запущен в режиме Long Polling...');
  let offset = 0;

  while (true) {
    try {
      const response = await fetch(`${TELEGRAM_API}/getUpdates?offset=${offset}&timeout=25`);
      const data = await response.json() as { ok: boolean; result: TelegramUpdate[] };

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch {
      // Пауза перед переподключением
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// Если скрипт вызван напрямую через tsx bot/index.ts
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  startLongPolling();
}
