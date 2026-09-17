/**
 * @file RenovationHotspots.tsx
 * Интерактивные круглые плашки действий над предметами комнаты в стиле Tile Family (Primer/12.jpg, 17.jpg, 19.jpg)
 */

import React from 'react';
import { RenovationHotspot } from '../types/game';

interface RenovationHotspotsProps {
  hotspot: RenovationHotspot;
  userStars: number;
  onActivate: () => void;
}

export const RenovationHotspots: React.FC<RenovationHotspotsProps> = ({
  hotspot,
  userStars: _userStars,
  onActivate
}) => {
  const renderIcon = () => {
    switch (hotspot.iconType) {
      case 'hammer':
        return <span className="text-2xl drop-shadow">🔨</span>;
      case 'window':
        return <span className="text-2xl drop-shadow">🪟</span>;
      case 'wrench':
        return <span className="text-2xl drop-shadow">🔧</span>;
      case 'bed':
        return <span className="text-2xl drop-shadow">🛏️</span>;
      case 'lamp':
        return <span className="text-2xl drop-shadow">💡</span>;
      case 'rug':
      case 'table':
      default:
        return <span className="text-2xl drop-shadow">🛋️</span>;
    }
  };

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none cursor-pointer group"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={onActivate}
    >
      {/* 1. Желтая анимированная рука/указатель клика (Primer/12.jpg) */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-bounce">
        <div className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          👇
        </div>
      </div>

      {/* 2. Основная круглая плашка действия с синим глянцем и белой обводкой */}
      <div className="relative w-15 h-15 rounded-full p-1 bg-gradient-to-b from-sky-300 via-sky-400 to-blue-600 border-[2.5px] border-white shadow-[0_8px_25px_rgba(37,99,235,0.6)] flex items-center justify-center transition-transform active:scale-90 group-hover:scale-105 animate-pulse-glow">
        {/* Внутренний фон иконки */}
        <div className="w-full h-full rounded-full bg-gradient-to-b from-sky-100 to-sky-200 flex items-center justify-center shadow-inner border border-sky-300/80">
          {renderIcon()}
        </div>

        {/* 3. Золотая капсула со стоимостью в звездах ⭐ снизу */}
        <div className="absolute -bottom-2.5 px-2 py-0.5 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-[1.5px] border-white flex items-center gap-1 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="text-xs">⭐</span>
          <span className="text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none">
            {hotspot.costStars}
          </span>
        </div>
      </div>

      {/* Название действия при наведении */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-amber-950/80 text-[10px] font-bold text-amber-100 border border-amber-400/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {hotspot.title}
      </div>
    </div>
  );
};
