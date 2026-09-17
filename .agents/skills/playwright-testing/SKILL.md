---
name: playwright-testing
description: "Use when running automated end-to-end browser tests, clicking through Telegram Mini App UI, validating user flows, reproducing bugs, and verifying fixes."
metadata:
  category: testing
  triggers: playwright, e2e, автотесты, тестирование интерфейса, browser automation, кликер тестов
---

# 🎭 Playwright E2E Testing for TMA

Автоматизированное E2E тестирование визуальной новеллы и Telegram Mini App: агент самостоятельно запускает сайт, кликает по элементам, эмулирует поведение игрока и чинит ошибки.

## 🕹️ Сценарии тестирования новеллы

### 1. Тестирование диалогового движка:
- Эмуляция клика/тапа по экрану для ускорения эффекта "печатной машинки".
- Проверка перехода к следующему узлу сюжета (Node transition).
- Проверка смены фонов и спрайтов персонажей (слои z-index).

### 2. Тестирование выборов и экономики:
- Клик по бесплатному выбору: проверка обновления статов (Свет / Тьма / Отвага).
- Клик по платному выбору (за кристаллы):
  - При достаточном балансе: списание кристаллов и открытие премиум-ветки.
  - При недостатке кристаллов: появление модального окна покупки / просмотра рекламы.

### 3. Тестирование таймеров и рекламы:
- Проверка обратного отсчета таймера ожидания (например, взлом двери).
- Клик по кнопке «Смотреть рекламу»: симуляция вызова SDK рекламы и получение награды (+2 💎).

### 4. Мобильная адаптивность TMA:
- Запуск в мобильном разрешении (390x844 - iPhone, 360x800 - Android).
- Проверка `Telegram.WebApp.expand()` и отсутствия ложных свайпов.

## 💻 Базовый скрипт прогона:
```typescript
import { test, expect } from '@playwright/test';

test('Прохождение вступительного диалога новеллы', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Ожидание загрузки TMA (< 1.5s)
  await expect(page.locator('#dialogue-box')).toBeVisible({ timeout: 1500 });
  
  // Клик для пропуска анимации текста
  await page.click('#dialogue-box');
  
  // Проверка появления кнопок выбора
  const choiceBtn = page.locator('button.choice-btn').first();
  await expect(choiceBtn).toBeVisible();
  await choiceBtn.click();
  
  // Проверка сохранения прогресса
  await expect(page.locator('#notification-toast')).toContainText('Прогресс сохранен');
});
```
