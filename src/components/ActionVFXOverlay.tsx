/**
 * @file ActionVFXOverlay.tsx
 * Анимированные визуальные эффекты действий (Tile Family style action effects)
 * - Полет и комичный отскок вантуза ("ЧПОК!")
 * - Заколачивание досок молотком ("ТУК-ТУК!")
 * - Вспышка магии и кристальные бабочки ("ВЖУХ! ✨")
 */

import React from 'react';

interface ActionVFXOverlayProps {
  actionType: 'plunger' | 'boards' | 'magic_shawl' | 'ice_amulet' | 'water' | null;
  onAnimationEnd?: () => void;
}

export const ActionVFXOverlay: React.FC<ActionVFXOverlayProps> = ({ actionType }) => {
  if (!actionType) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* 1. Комичный фейл: Вантуз летит в окно и отскакивает */}
      {actionType === 'plunger' && (
        <div className="relative w-full h-full">
          {/* Траектория полета вантуза к окну */}
          <div className="absolute top-[28%] left-[32%] -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <img 
              src="/assets/props/plunger.png" 
              alt="Вантуз" 
              className="w-24 h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] rotate-[25deg] transition-transform" 
            />
            {/* Комичный речевой бабл "ЧПОК!" */}
            <div className="absolute -top-10 -right-8 px-3 py-1 bg-yellow-400 border-2 border-red-600 rounded-full font-black text-red-700 text-sm shadow-xl rotate-12 animate-pulse uppercase tracking-wider">
              ЧПОК! 💥
            </div>
          </div>

          {/* Комичная капелька пота над Золушкой */}
          <div className="absolute top-[35%] left-[52%] text-2xl animate-bounce">
            💧
          </div>
        </div>
      )}

      {/* 2. Стандартный ремонт: Заколачивание досок */}
      {actionType === 'boards' && (
        <div className="relative w-full h-full">
          {/* Доски на окне */}
          <div className="absolute top-[26%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 rotate-[-6deg] animate-pop-in">
            <div className="w-28 h-6 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border border-amber-950 rounded shadow-2xl flex items-center justify-between px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
            </div>
            <div className="w-32 h-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border border-amber-950 rounded shadow-2xl rotate-3 flex items-center justify-between px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
            </div>
          </div>

          {/* Молоточек и звук ТУК-ТУК */}
          <div className="absolute top-[20%] left-[38%] animate-hand">
            <span className="text-4xl drop-shadow-lg">🔨</span>
            <div className="absolute -top-6 -right-6 px-2.5 py-0.5 bg-amber-400 border border-amber-900 rounded-full font-black text-amber-950 text-xs shadow-lg uppercase">
              ТУК-ТУК!
            </div>
          </div>
        </div>
      )}

      {/* 3. Премиум магия: Шаль или Ледяной Амулет */}
      {(actionType === 'magic_shawl' || actionType === 'ice_amulet') && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Расширяющийся радиальный круг магического сияния */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-sky-400/50 via-purple-500/40 to-amber-300/50 blur-2xl animate-ping" />

          {/* Парящий в центре артефакт */}
          <div className="relative flex flex-col items-center animate-bounce">
            <div className="w-24 h-24 rounded-full bg-slate-950/80 border-4 border-amber-300 shadow-[0_0_40px_rgba(56,189,248,0.9)] flex items-center justify-center p-3">
              <img
                src={actionType === 'magic_shawl' ? '/assets/props/magic_shawl.png' : '/assets/props/ice_amulet.png'}
                alt="Магия"
                className="w-16 h-16 object-contain animate-pulse"
              />
            </div>
            <div className="mt-2 px-4 py-1 bg-gradient-to-r from-sky-400 to-purple-400 border-2 border-white rounded-full text-slate-950 font-black text-sm uppercase tracking-wider shadow-2xl">
              ✨ ТРИУМФ! ✨
            </div>
          </div>

          {/* Россыпь золотых и лазурных искр */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xl animate-ping"
              style={{
                top: `${30 + (i * 11) % 40}%`,
                left: `${20 + (i * 15) % 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
