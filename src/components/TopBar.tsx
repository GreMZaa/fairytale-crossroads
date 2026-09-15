/**
 * @file TopBar.tsx
 * Верхняя статус-панель в точном дизайне Tile Family (Primer/1.jpg & 21.jpg)
 * Аватар профиля, шкала уровня с сундуком на конце, баланс валюты, шестеренка настроек.
 */

import React from 'react';
import { Settings } from 'lucide-react';
import { UserStats } from '../types/game';

interface TopBarProps {
  crystals: number;
  keys: number;
  stats?: UserStats;
  isMuted: boolean;
  currentStep?: number;
  totalSteps?: number;
  onToggleSound: () => void;
  onOpenStats: () => void;
  onOpenShop: () => void;
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  crystals,
  keys,
  stats: _stats,
  isMuted: _isMuted,
  currentStep = 1,
  totalSteps = 3,
  onToggleSound: _onToggleSound,
  onOpenStats,
  onOpenShop,
  onOpenSettings,
}) => {
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <header className="absolute top-0 left-0 right-0 z-40 px-3 pt-2.5 pb-1 flex items-center justify-between select-none pointer-events-auto">
      {/* 1. Левая часть: Круглый аватар профиля с золотой рамкой и бейджем уровня (Primer/1.jpg) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenStats}
          className="relative group active:scale-95 transition-transform"
          title="Профиль игрока"
        >
          {/* Золотая рамка аватара */}
          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-[0_3px_10px_rgba(0,0,0,0.6)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-white/60">
              <img
                src="/assets/characters/cinderella_cold.png"
                alt="Профиль"
                className="w-full h-full object-cover object-top scale-125"
              />
            </div>
          </div>
          {/* Бейдж уровня персонажа внизу справа аватара */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-md">
            1
          </div>
        </button>

        {/* 2. Шкала прогресса с сундучком на конце (Primer/21.jpg) */}
        <div 
          onClick={onOpenStats}
          className="relative flex items-center bg-[#0F223D]/90 border-2 border-[#38BDF8]/60 rounded-full h-7 pl-2.5 pr-6 min-w-[95px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer active:scale-95 transition-transform"
        >
          {/* Заполнение прогресс-бара */}
          <div 
            className="absolute left-0.5 top-0.5 bottom-0.5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 shadow-inner"
            style={{ width: `${progressPercent}%` }}
          />
          <span className="relative z-10 text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {currentStep}/{totalSteps}
          </span>

          {/* Золотой сундучок с самоцветом, прикрепленный к концу бара */}
          <div 
            className="absolute -right-3 w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-100 flex items-center justify-center text-sm shadow-[0_2px_8px_rgba(245,158,11,0.6)] animate-bounce"
            title="Сундук с сокровищами"
          >
            🎁
          </div>
        </div>
      </div>

      {/* 3. Правая часть: Кристаллы, Ключи и Шестеренка Настроек (Primer/1.jpg) */}
      <div className="flex items-center gap-1.5">
        {/* Кристаллы с зеленой кнопкой + */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1 bg-gradient-to-b from-[#1C2C47] to-[#0F1B2E] border-2 border-[#38BDF8]/70 rounded-full pl-2 pr-1 py-0.5 shadow-[0_3px_8px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
        >
          <span className="text-sky-400 text-xs animate-pulse">💎</span>
          <span className="text-white text-xs font-black drop-shadow">{crystals}</span>
          <div className="bg-gradient-to-b from-emerald-400 to-emerald-600 border border-white text-white font-black rounded-full w-4 h-4 flex items-center justify-center text-[11px] ml-0.5 shadow">
            +
          </div>
        </button>

        {/* Ключи (Энергия / Звезды) */}
        <div 
          className="flex items-center gap-1 bg-gradient-to-b from-[#1C2C47] to-[#0F1B2E] border-2 border-amber-500/70 rounded-full px-2 py-0.5 shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
          title="Ключи энергии"
        >
          <span className="text-amber-400 text-xs">🔑</span>
          <span className="text-amber-200 text-xs font-black drop-shadow">{keys}</span>
        </div>

        {/* Синяя круглая 3D кнопка Настроек (Primer/1.jpg) */}
        <button
          onClick={onOpenSettings || onOpenStats}
          className="w-8 h-8 rounded-full bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800 border-2 border-white/90 flex items-center justify-center text-white active:scale-90 shadow-[0_3px_10px_rgba(0,0,0,0.6)] transition-transform"
          aria-label="Настройки"
        >
          <Settings className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};
export default TopBar;
