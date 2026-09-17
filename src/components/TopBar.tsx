/**
 * @file TopBar.tsx
 * Верхняя панель в точном визуальном стиле Tile Family (Primer/1.jpg & 12.jpg)
 * Никаких неоновых AI акцентов — теплая уютная палитра, капсулы валют, золотые звезды ⭐ и сундучок прогресса.
 */

import React from 'react';
import { Settings } from 'lucide-react';

interface TopBarProps {
  coins: number;
  lives: number;
  stars: number;
  crystals: number;
  currentStep: number;
  totalSteps: number;
  onOpenShop: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  coins = 2000,
  lives = 5,
  stars = 2,
  crystals: _crystals = 25,
  currentStep = 0,
  totalSteps = 12,
  onOpenShop,
  onOpenSettings
}) => {
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <header className="relative w-full z-40 px-2.5 pt-2 pb-1 flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* 1. Верхний ряд: Монеты, Жизни, Звезды, Настройки (Primer/1.jpg) */}
      <div className="flex items-center justify-between gap-1.5">
        
        {/* Аватарка персонажа / профиля */}
        <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 border border-white shadow-md shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-amber-100 flex items-center justify-center">
            <span className="text-xl">🐶</span>
          </div>
        </div>

        {/* Капсула монет (Primer/1.jpg: 2000 +) */}
        <button
          onClick={onOpenShop}
          className="flex-1 flex items-center justify-between bg-gradient-to-b from-[#FFFDF7] to-[#F7ECD4] border-[1.5px] border-[#D4A373] rounded-full px-2 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)] active:scale-95 transition-transform"
          title="Монеты"
        >
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-base drop-shadow">🪙</span>
            <span className="text-[12px] font-black text-[#5C3A21] truncate leading-none">
              {coins}
            </span>
          </div>
          <div className="w-4 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 border border-white flex items-center justify-center text-white text-[11px] font-black shadow-sm ml-1 shrink-0">
            +
          </div>
        </button>

        {/* Капсула жизней / энергии (Primer/1.jpg: ❤️ 5 Полный) */}
        <div className="flex-1 flex items-center gap-1 bg-gradient-to-b from-[#FFFDF7] to-[#F7ECD4] border-[1.5px] border-[#D4A373] rounded-full px-2 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
          <span className="text-base drop-shadow">❤️</span>
          <span className="text-[12px] font-black text-[#B91C1C] leading-none">{lives}</span>
          <span className="text-[9px] font-bold text-[#7A4B29] hidden sm:inline leading-none">Полный</span>
        </div>

        {/* Капсула Звезд ⭐ (Главная валюта ремонта в Tile Family) */}
        <div 
          onClick={onOpenShop}
          className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-b from-[#FFFDF7] to-[#F7ECD4] border-[1.5px] border-amber-400 rounded-full px-2 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.25)] cursor-pointer active:scale-95 transition-transform"
          title="Звезды для ремонта"
        >
          <span className="text-base drop-shadow animate-pulse">⭐</span>
          <span className="text-[13px] font-black text-amber-900 leading-none">{stars}</span>
        </div>

        {/* Кнопка настроек в стиле синего деревянного цветка (Primer/1.jpg) */}
        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700 border-[1.5px] border-white flex items-center justify-center text-white shadow-md active:scale-90 transition-transform shrink-0"
          aria-label="Настройки"
        >
          <Settings className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Нижний ряд: Глянцевая синяя шкала прогресса комнаты с сундучком (Primer/1.jpg & 12.jpg) */}
      <div className="w-full flex items-center justify-center px-4">
        <div className="relative w-full max-w-xs h-6 bg-[#004B87] border-2 border-[#60A5FA] rounded-full p-0.5 shadow-[0_3px_10px_rgba(0,0,0,0.4)] flex items-center">
          
          {/* Заливка прогресса сочным зеленым градиентом */}
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 rounded-full transition-all duration-500 shadow-inner flex items-center justify-end pr-1"
            style={{ width: `${Math.max(8, progressPercent)}%` }}
          />

          {/* Цифры прогресса по центру */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wider">
              {currentStep}/{totalSteps}
            </span>
          </div>

          {/* Золотой сундук на конце шкалы (Primer/12.jpg) */}
          <div 
            onClick={onOpenShop}
            className="absolute -right-3 w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 border-white flex items-center justify-center text-sm shadow-[0_3px_10px_rgba(245,158,11,0.6)] cursor-pointer animate-bounce"
            title="Сундук главы"
          >
            🎁
          </div>
        </div>
      </div>
    </header>
  );
};
