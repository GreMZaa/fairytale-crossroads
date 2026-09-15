/**
 * @file TopBar.tsx
 * Верхняя панель: Баланс кристаллов 💎, ключей 🔑, индикатор статов и звук
 */

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
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
}

export const TopBar: React.FC<TopBarProps> = ({
  crystals,
  keys,
  stats: _stats,
  isMuted,
  currentStep = 1,
  totalSteps = 3,
  onToggleSound,
  onOpenStats,
  onOpenShop,
}) => {
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <header className="absolute top-0 left-0 right-0 z-40 px-3.5 pt-3 pb-2 flex items-center justify-between select-none pointer-events-auto">
      {/* Левая часть: Полоса прогресса главы с сундучком */}
      <div className="flex items-center gap-1.5">
        <div 
          onClick={onOpenStats}
          className="relative flex items-center bg-[#1E293B]/90 border-2 border-[#38BDF8]/60 rounded-full h-7 px-2.5 min-w-[95px] shadow-lg cursor-pointer active:scale-95 transition-transform"
        >
          {/* Заполнение прогресс-бара */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 opacity-90"
            style={{ width: `${progressPercent}%` }}
          />
          <span className="relative z-10 text-[11px] font-black text-white drop-shadow">
            {currentStep}/{totalSteps}
          </span>
        </div>

        {/* Золотой сундучок с наградой */}
        <div 
          onClick={onOpenStats}
          className="relative -ml-3 w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-100 flex items-center justify-center text-sm shadow-md cursor-pointer animate-bounce"
          title="Награда за главу"
        >
          🎁
        </div>
      </div>

      {/* Правая часть: Ключи, Кристаллы и Настройки */}
      <div className="flex items-center gap-1.5">
        {/* Ключи (Энергия) */}
        <div 
          className="flex items-center gap-1 bg-[#1E293B]/90 border border-amber-500/50 rounded-full px-2.5 py-1 text-xs font-black text-amber-300 shadow-md"
          title="Ключи энергии"
        >
          <span>🔑</span>
          <span>{keys}</span>
        </div>

        {/* Кристаллы с кнопкой + */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1 bg-gradient-to-r from-sky-950/90 to-slate-900/90 border border-sky-400/60 rounded-full px-2.5 py-1 text-xs font-black text-sky-200 shadow-md active:scale-95 transition-transform"
        >
          <span className="text-sky-400 animate-pulse">💎</span>
          <span>{crystals}</span>
          <span className="bg-sky-500 text-slate-950 font-black rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px] ml-0.5 shadow-sm">
            +
          </span>
        </button>

        {/* Переключатель звука */}
        <button
          onClick={onToggleSound}
          className="w-7 h-7 rounded-full bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-200 active:scale-95 shadow-md transition-transform"
          aria-label="Звук"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
};
