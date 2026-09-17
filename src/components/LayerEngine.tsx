/**
 * @file LayerEngine.tsx
 * 5-слойный графический движок новеллы по спецификации Z-Index Layering (ui-ux-docs.md)
 * Layer 0 (z-0): Фоны
 * Layer 1 (z-10): Частицы и спецэффекты (снег, искры, красный shake)
 * Layer 2 (z-20): Спрайты персонажей с покачиванием
 * Layer 3 (z-30): Диалоговое окно, кнопки выборов, таймеры
 * Layer 4 (z-50): Модальные окна
 */

import React from 'react';
import { EpisodeNode } from '../types/game';

interface LayerEngineProps {
  node: EpisodeNode;
  isFailState: boolean;
  isMagicState: boolean;
  children: React.ReactNode;
}

export const LayerEngine: React.FC<LayerEngineProps> = ({
  node,
  isFailState,
  isMagicState,
  children
}) => {
  // Рендер фона локации (Layer 0)
  const renderBackground = () => {
    switch (node.background) {
      case 'corridor_fire':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="/assets/backgrounds/corridor_fire.png" 
              alt="Пылающая лестница" 
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
          </div>
        );
      case 'corridor_escape':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-slate-900 to-slate-950 overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-amber-500/15 to-transparent blur-lg" />
          </div>
        );
      case 'attic_ice':
      default:
        return (
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="/assets/backgrounds/attic_ice.png" 
              alt="Ледяной чердак" 
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
          </div>
        );
    }
  };

  // Рендер частиц и атмосферных спецэффектов (Layer 1)
  const renderParticles = () => {
    if (node.background === 'corridor_fire') {
      return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-orange-400/80 animate-ping"
              style={{
                left: `${(i * 7 + 10) % 95}%`,
                bottom: `${(i * 12 + 5) % 80}%`,
                animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      );
    }

    // По умолчанию: Метель и снег
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/70 animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 6 + 4) % 96}%`,
              top: `${(i * 8 + 10) % 90}%`,
              opacity: (i % 5 + 3) / 10,
              animationDuration: `${2 + (i % 4)}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Рендер спрайта персонажа (Layer 2)
  const renderCharacter = () => {
    if (!node.character) return null;

    const isPrince = node.character.id === 'prince';

    return (
      <div 
        className={`absolute inset-x-0 z-20 pointer-events-none transition-all duration-700 flex justify-center items-end ${
          isFailState ? 'animate-shake' : 'animate-pulse-subtle'
        }`}
        style={{ top: '62px', bottom: '190px' }}
      >
        <div className="relative h-full max-h-full flex items-end justify-center px-4">
          <img
            src={isPrince ? '/assets/characters/prince_cape.png' : '/assets/characters/cinderella_cold.png'}
            alt={node.character.name}
            className="max-h-full w-auto max-w-[85vw] object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] filter contrast-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between bg-slate-950 select-none">
      {/* Layer 0: Задний фон */}
      <div className="absolute inset-0 z-0">
        {renderBackground()}
      </div>

      {/* Layer 1: Частицы и вспышки */}
      {renderParticles()}

      {/* Вспышка красного при фейле (Вантуз/Веер) */}
      {isFailState && (
        <div className="absolute inset-0 z-15 bg-rose-600/35 pointer-events-none animate-pulse transition-opacity" />
      )}

      {/* Вспышка магии при премиуме (Шаль/Амулет) */}
      {isMagicState && (
        <div className="absolute inset-0 z-15 bg-sky-400/25 pointer-events-none animate-shimmer transition-opacity" />
      )}

      {/* Layer 2: Персонажи */}
      {renderCharacter()}

      {/* Layer 3: Игровой UI, диалоги и интерактивные кнопки */}
      <div className="relative z-30 w-full flex-1 flex flex-col justify-end p-4 pb-6 pt-16 max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};
