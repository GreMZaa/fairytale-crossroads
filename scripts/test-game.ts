/**
 * @file test-game.ts
 * Сквозные тесты криптографии, безопасности, сохранения прогресса и монетизации
 */

import crypto from 'crypto';
import { validateTelegramInitData } from '../api/auth/validate';
import { handleGetStories } from '../api/stories/index';
import { handleSaveProgress } from '../api/progress/save';
import { handleAdReward } from '../api/ads/reward';
import { UserService } from '../api/lib/userService';

async function runAllTests() {
  console.log('🧪 Запуск сквозных тестов новеллы «Сказки: Перекрестки Судеб»...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // =========================================================================
  // ТЕСТ 1: Криптографическая валидация Telegram initData (HMAC-SHA256)
  // =========================================================================
  console.log('--- 1. Безопасность и Валидация HMAC Telegram initData ---');
  const testBotToken = '123456789:ABCDefGhIjKlMnOpQrStUvWxYz';
  const testUser = { id: 777001, first_name: 'Elena', username: 'elena_test' };
  const authDate = Math.floor(Date.now() / 1000);

  // Генерируем валидную строку данных Telegram
  const items = [
    `auth_date=${authDate}`,
    `query_id=AAHdF6IQAAAAAN0XohDhrOrc`,
    `user=${JSON.stringify(testUser)}`
  ];
  items.sort();
  const dataCheckString = items.join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(testBotToken).digest();
  const validHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  const validInitData = `${items.join('&')}&hash=${validHash}`;

  const resValid = validateTelegramInitData(validInitData, testBotToken);
  assert(resValid.isValid === true, 'Валидный initData успешно проходит HMAC-SHA256 проверку');
  assert(resValid.user?.id === testUser.id, 'Извлечен корректный telegram_id пользователя');

  // Проверка фальшивого хеша
  const forgedInitData = `${items.join('&')}&hash=0000000000000000000000000000000000000000000000000000000000000000`;
  const resForged = validateTelegramInitData(forgedInitData, testBotToken);
  assert(resForged.isValid === false, 'Фальшивая подпись отклоняется (Защита от IDOR)');

  // Проверка просроченной подписи (Replay attack protection)
  const oldAuthDate = authDate - 90000; // > 24 часов
  const oldItems = [
    `auth_date=${oldAuthDate}`,
    `query_id=AAHdF6IQAAAAAN0XohDhrOrc`,
    `user=${JSON.stringify(testUser)}`
  ];
  oldItems.sort();
  const oldCheckString = oldItems.join('\n');
  const oldHash = crypto.createHmac('sha256', secretKey).update(oldCheckString).digest('hex');
  const expiredInitData = `${oldItems.join('&')}&hash=${oldHash}`;
  const resExpired = validateTelegramInitData(expiredInitData, testBotToken);
  assert(resExpired.isValid === false, 'Просроченная подпись отклоняется (Защита от Replay-атак)');

  // =========================================================================
  // ТЕСТ 2: Получение историй и контента
  // =========================================================================
  console.log('\n--- 2. Контент и Сюжетное Дерево ---');
  const storiesRes = await handleGetStories();
  assert(storiesRes.success === true, 'GET /api/stories успешно возвращает список историй');
  assert(storiesRes.stories.length > 0, 'В списке присутствует как минимум 1 активная история');
  assert(storiesRes.stories[0].id === 'cinderella', 'Первая история — «Золушка: Хрустальные Цепи»');

  // =========================================================================
  // ТЕСТ 3: Выборы, Сохранение прогресса и Защита от Mass Assignment
  // =========================================================================
  console.log('\n--- 3. Игровой Процесс и Статы ---');
  const playerTgId = 888999;
  const user = await UserService.getOrCreateUser(playerTgId, 'cinderella_player', 'Анна');
  assert(user.crystals === 25, 'Новый игрок получает стартовый приветственный бонус 25 💎');
  assert(user.keys === 2, 'Новый игрок получает 2 🔑 энергии');

  // 3.1 Обычный выбор (Доски)
  const choiceBoards = await handleSaveProgress({
    telegram_id: playerTgId,
    story_id: 'cinderella',
    episode_id: 'cinderella-ep1',
    node_id: 'node_1',
    choice_id: 'choice_boards'
  });
  assert(choiceBoards.status === 200, 'POST /api/progress/save принимает легитимный выбор');
  assert(choiceBoards.body.nextNodeId === 'node_2_timer', 'Выбор досок переводит к узлу таймера двери');
  assert(choiceBoards.body.updatedStats.courage === 1, 'Стат Отваги увеличился на сервере (+1)');

  // 3.2 Фейловый выбор (Вантуз)
  const choicePlunger = await handleSaveProgress({
    telegram_id: playerTgId,
    story_id: 'cinderella',
    episode_id: 'cinderella-ep1',
    node_id: 'node_1',
    choice_id: 'choice_plunger'
  });
  assert(choicePlunger.body.nextNodeId === 'node_1', 'Фейловый выбор возвращает на повторение ситуации');
  assert(choiceBoards.body.crystals === 25, 'Фейловый выбор бесплатный, кристаллы не списываются');

  // 3.3 Премиум-выбор (Магическая шаль: 20 💎)
  const choiceShawl = await handleSaveProgress({
    telegram_id: playerTgId,
    story_id: 'cinderella',
    episode_id: 'cinderella-ep1',
    node_id: 'node_1',
    choice_id: 'choice_shawl'
  });
  assert(choiceShawl.body.crystals === 5, 'Списаны 20 💎 за премиум-выбор (остаток: 5)');
  assert(choiceShawl.body.updatedStats.light_path === 1, 'Начислен Путь Света (+1)');
  assert(choiceShawl.body.nextNodeId === 'node_3_fire', 'Премиум-выбор переносит сразу к следующей сцене');

  // 3.4 Попытка премиум-выбора при нехватке кристаллов
  const choiceAmuletFail = await handleSaveProgress({
    telegram_id: playerTgId,
    story_id: 'cinderella',
    episode_id: 'cinderella-ep1',
    node_id: 'node_3_fire',
    choice_id: 'choice_ice_amulet' // стоит 20, а у юзера осталось 5
  });
  assert(choiceAmuletFail.body.success === false, 'Премиум-выбор без нужного баланса кристаллов блокируется');
  assert(choiceAmuletFail.body.error === 'INSUFFICIENT_CRYSTALS', 'Сервер возвращает ошибку нехватки валюты');

  // =========================================================================
  // ТЕСТ 4: Монетизация (Rewarded Ads: +2 💎)
  // =========================================================================
  console.log('\n--- 4. Монетизация (Rewarded Video Ads) ---');
  const adReward = await handleAdReward({
    telegram_id: playerTgId,
    ad_type: 'rewarded_video'
  });
  assert(adReward.status === 200, 'POST /api/ads/reward успешно обрабатывает просмотр');
  assert(adReward.body.reward_crystals === 2, 'Сервер начисляет строго +2 💎');
  assert(adReward.body.new_balance === 7, 'Баланс игрока увеличен с 5 до 7 💎');

  console.log(`\n🎉 Результаты тестирования: Успешно: ${passed}, Ошибок: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal error during tests:', err);
  process.exit(1);
});
