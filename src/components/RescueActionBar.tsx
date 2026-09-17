/**
 * @file RescueActionBar.tsx
 * Нижняя панель действий с золотой кнопкой "Помощь" со стрелкой и сочной зеленой кнопкой "Уровень [N]" (Primer/1.jpg)
 */

import React from 'react';

interface RescueActionBarProps {
  currentStep: number;
  totalSteps: number;
  onOpenRescue: () => void;
  onPlayLevel: () => void;
  isRescueActive?: boolean;
}

export const RescueActionBar: React.FC<RescueActionBarProps> = ({
  currentStep,
  totalSteps,
  onOpenRescue,
  onPlayLevel,
  isRescueActive: _isRescueActive = false
}) => {
  return (
    <div className="relative w-full px-3 py-1.5 flex items-center justify-between gap-3 z-30 select-none">
      {/* 1. Левая кнопка: Золотая плашка "Помощь" со стрелкой ⬇️ (Primer/1.jpg) */}
      <div className="relative flex-1">
        {/* Желтая анимированная стрелка вниз над кнопкой */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20 animate-bounce">
          <div className="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            ⬇️
          </div>
        </div>

        <button
          onClick={onOpenRescue}
          className="group relative w-full h-15 rounded-2xl p-1 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-100 shadow-[0_6px_20px_rgba(245,158,11,0.5),0_0_15px_rgba(251,191,36,0.3)] transition-all active:scale-95 hover:scale-[1.01]"
        >
          {/* Красный круглый бейдж уведомления (1) */}
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-b from-rose-500 to-red-700 border-2 border-white flex items-center justify-center text-white text-[11px] font-black shadow-lg z-10 animate-pulse">
            1
          </div>

          {/* Внутреннее золотое тело кнопки */}
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 flex items-center px-2 gap-2 border-t border-white/80 shadow-inner">
            {/* Аватар замерзающего персонажа (Primer/1.jpg) */}
            <div className="w-10 h-10 rounded-full bg-amber-400 p-0.5 shadow shrink-0 border border-amber-500 overflow-hidden">
              <img
                src="/assets/primer/10.jpg"
                alt="Помощь"
                className="w-full h-full object-cover object-top scale-135"
              />
            </div>

            {/* Текст и синий бейдж прогресса (0/12) */}
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[14px] sm:text-base font-black text-[#5C3A21] leading-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] tracking-tight">
                Помощь
              </span>
              <div className="mt-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 border border-sky-300 text-white font-black text-[10px] shadow-sm">
                {currentStep}/{totalSteps}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* 2. Правая кнопка: Сочная зеленая 3D кнопка "Уровень [N]" (Primer/1.jpg) */}
      <div className="flex-1">
        <button
          onClick={onPlayLevel}
          className="group relative w-full h-15 rounded-2xl p-1 bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700 border-2 border-emerald-100 shadow-[0_6px_20px_rgba(16,185,129,0.5),0_0_15px_rgba(52,211,153,0.3)] transition-all active:scale-95 hover:scale-[1.01]"
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center border-t border-emerald-200/80 shadow-inner gap-1.5">
            <span className="text-base sm:text-lg font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Уровень {currentStep + 1}
            </span>
            <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-black shadow-sm">
              ⭐
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
export default RescueActionBar;
