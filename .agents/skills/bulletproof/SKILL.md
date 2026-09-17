---
name: bulletproof
description: "Use when executing enterprise-grade engineering workflows: rigorous planning, test-driven implementation, gauntlet code review, and automated production deployment."
metadata:
  category: workflow
  triggers: bulletproof, надежный пайплайн, план тесты ревью, prod-ready, enterprise workflow
---

# 🛡️ Bulletproof Engineering Workflow

Стандарт разработки «код по-взрослому»: переход от хаотичного кодинга к циклу **План → Тесты → Ревью → Деплой**.

## 🔄 Четыре столпа Bulletproof

### 1. 📋 План (Rigorous Plan)
- Никакого кода без зафиксированного плана.
- Задача декомпозируется в `.agents/rules/tasks.json` на атомарные шаги с критериями приемки (Acceptance Criteria).
- Обязательно определяются: влияние на схему БД (Supabase), контракты API и сценарии сбоев.

### 2. 🧪 Тесты (Zero Guesswork Testing)
- **Unit/Integration:** Проверка чистой логики (движок переходов диалогов, начисление кристаллов, валидация HMAC).
- **E2E Playwright:** Автоматический прогон интерфейса (клик по кнопкам выборов, открытие модалок, эмуляция рекламы и таймаутов).
- Запрет перехода к следующему этапу при наличии хотя бы одного упавшего теста.

### 3. 🔍 Ревью (Gauntlet Critic)
- Запуск независимого агента-критика с жесткими критериями качества.
- Проверка соответствия стилям (`frontend-design`, Apple HIG) и безопасности (`security-review`).
- Устранение всех замечаний критика до слияния.

### 4. 🚀 Деплой (Safe Deployment)
- Проверка сборки (`npm run build`) без ошибок типов TypeScript.
- Безопасная накатка SQL-миграций в Supabase.
- Деплой на Vercel с проверкой live URL и Webhook Telegram бота.
- Фиксация статуса в `.agents/roadmap.md` и непрерывном логе `.agents/progress.md`.
