/**
 * @file LayerEngine.tsx
 * Графический движок сцены новеллы с динамической сменой комнат по мере ремонта (Primer/12.jpg -> 40.jpg)
 */

import React from 'react';
import { ActionVFXOverlay } from './ActionVFXOverlay';

interface LayerEngineProps {
  currentBackground: string;
  isFailState?: boolean;
  isMagicState?: boolean;
  activeActionAnimation?: 'plunger' | 'boards' | 'magic_shawl' | 'ice_amulet' | 'water' | null;
  children: React.ReactNode;
}

export const LayerEngine: React.FC<LayerEngineProps> = ({
  currentBackground,
  isFailState: _isFailState = false,
  isMagicState = false,
  activeActionAnimation = null,
  children
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
      {/* 1. Слой 0: Динамический фон комнаты (Меняется по мере ремонта!) */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <img
          src={currentBackground}
          alt="Комната"
          className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-100"
        />

        {/* Мягкий градиент затемнения сверху и снизу для читаемости UI */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Слой 1: Частицы магии и уюта */}
      {isMagicState && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-300 animate-ping"
              style={{
                left: `${(i * 7 + 10) % 92}%`,
                top: `${(i * 11 + 20) % 80}%`,
                animationDuration: `${0.8 + (i % 3) * 0.3}s`,
                animationDelay: `${i * 0.08}s`
              }}
            />
          ))}
        </div>
      )}

      {/* 3. Слой 2: Оверлей действий (Вантуз, Ремонт, Вспышка) */}
      <ActionVFXOverlay actionType={activeActionAnimation} />

      {/* 4. Слой 3: Пользовательский интерфейс и диалоги */}
      <div className="relative z-30 w-full h-full flex flex-col justify-between p-2">
        {children}
      </div>
    </div>
  );
};
export default LayerEngine;
