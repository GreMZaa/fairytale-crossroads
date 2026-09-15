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

import { ActionVFXOverlay } from './ActionVFXOverlay';

interface LayerEngineProps {
  node: EpisodeNode;
  isFailState: boolean;
  isMagicState: boolean;
  activeActionAnimation?: 'plunger' | 'boards' | 'magic_shawl' | 'ice_amulet' | 'water' | null;
  onHotspotClick?: () => void;
  children: React.ReactNode;
}

export const LayerEngine: React.FC<LayerEngineProps> = ({
  node,
  isFailState,
  isMagicState,
  activeActionAnimation = null,
  onHotspotClick,
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

  // Рендер спрайта персонажа (Layer 2) с анимацией озноба
  const renderCharacter = () => {
    if (!node.character) return null;

    const isPrince = node.character.id === 'prince';

    return (
      <div 
        className={`absolute bottom-0 inset-x-0 z-20 pointer-events-none transition-all duration-700 flex justify-center ${
          node.character.position === 'right' ? 'justify-end pr-2' : 'justify-center'
        } ${isFailState ? 'animate-shake' : isPrince ? 'animate-pulse-subtle' : 'animate-shiver'}`}
      >
        <div className="relative flex flex-col items-center">
          <img
            src={isPrince ? '/assets/characters/prince_cape.png' : '/assets/characters/cinderella_cold.png'}
            alt={node.character.name}
            className="h-[50vh] max-h-[480px] w-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] filter contrast-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Морозное дыхание Золушки на ледяном чердаке */}
          {!isPrince && (
            <div className="absolute top-[26%] left-[53%] w-3 h-3 rounded-full bg-white/40 blur-xs animate-ping pointer-events-none" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between bg-slate-950 select-none">
      {/* Layer 0: Задний фон */}
      <div className="absolute inset-0 z-0">
        {renderBackground()}
      </div>

      {/* Layer 1: Частицы и вспышки */}
      {renderParticles()}

      {/* Интерактивный маркер починки на сломанном объекте (как в Tile Family) */}
      {node.puzzle && (
        <div 
          onClick={onHotspotClick}
          className="absolute top-[28%] left-[28%] z-25 cursor-pointer pointer-events-auto group animate-pop-in"
          title="Починить окно"
        >
          {/* Пульсирующий ореол внимания */}
          <div className="absolute -inset-2 rounded-full bg-sky-400/40 animate-ping pointer-events-none" />

          {/* Круглый значок ремонта с молоточком */}
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 border-2 border-white shadow-[0_6px_20px_rgba(37,99,235,0.8)] flex items-center justify-center text-xl active:scale-90 transition-transform animate-pulse-glow">
            🔨
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border border-white text-[10px] font-black text-amber-950 flex items-center justify-center shadow">
              ⭐
            </span>
          </div>

          {/* Анимированная указывающая белая рука 👆 */}
          <div className="absolute top-8 left-8 text-3xl pointer-events-none animate-hand drop-shadow-lg">
            👆
          </div>
        </div>
      )}

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

      {/* Анимационный оверлей визуальных действий (Вантуз летит, доски забиваются, магия) */}
      <ActionVFXOverlay actionType={activeActionAnimation} />

      {/* Затемнение снизу для идеальной читаемости диалогов и выборов */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none z-25" />

      {/* Layer 3: Игровой UI, диалоги и интерактивные кнопки */}
      <div className="relative z-30 w-full flex-1 flex flex-col justify-end p-3.5 pb-4 pt-14">
        {children}
      </div>
    </div>
  );
};
