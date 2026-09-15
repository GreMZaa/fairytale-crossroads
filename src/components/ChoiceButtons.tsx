/**
 * @file ChoiceButtons.tsx
 * Блок интерактивных выборов предметов (Ad-like Puzzles)
 * Поддерживает обычные предметы, абсурдный фейл (вантуз) и премиум-магию
 */

import React from 'react';
import { Sparkles, Tv } from 'lucide-react';
import { PuzzleChoice } from '../types/game';
import { 
  BoardsIcon, 
  BucketIcon, 
  FanIcon 
} from './VisualAssets';

interface ChoiceButtonsProps {
  choices: PuzzleChoice[];
  userCrystals: number;
  onSelectChoice: (choice: PuzzleChoice) => void;
  onWatchAdForChoice?: (choice: PuzzleChoice) => void;
  onClose?: () => void;
  disabled?: boolean;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  choices,
  userCrystals,
  onSelectChoice,
  onWatchAdForChoice,
  onClose,
  disabled = false
}) => {
  const renderItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'boards':
        return <BoardsIcon className="w-7 h-7" />;
      case 'plunger':
        return (
          <img 
            src="/assets/props/plunger.png" 
            alt="Вантуз" 
            className="w-8 h-8 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" 
          />
        );
      case 'magic_shawl':
        return (
          <img 
            src="/assets/props/magic_shawl.png" 
            alt="Магическая шаль" 
            className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
          />
        );
      case 'bucket':
        return <BucketIcon className="w-7 h-7" />;
      case 'fan':
        return <FanIcon className="w-7 h-7" />;
      case 'ice_amulet':
        return (
          <img 
            src="/assets/props/ice_amulet.png" 
            alt="Ледяной амулет" 
            className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(125,211,252,0.6)]" 
          />
        );
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 z-30 select-none animate-pop-in">
      {/* Заголовок лотка инструментов в стиле Tile Family */}
      <div className="flex items-center justify-between px-1 mb-0.5">
        <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1 drop-shadow">
          <span>🛠️</span>
          <span>Выберите решение:</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-semibold">
            1 из 3
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-[10px] text-amber-300 hover:text-white px-2 py-0.5 rounded-full bg-slate-900/90 border border-amber-500/40 active:scale-90 transition-transform"
            >
              Свернуть ✕
            </button>
          )}
        </div>
      </div>

      {choices.map((choice) => {
        const isPremium = choice.type === 'premium';
        const isFail = choice.type === 'fail';
        const hasEnoughCrystals = userCrystals >= choice.cost;

        return (
          <div
            key={choice.id}
            className={`relative group rounded-xl p-[1px] transition-all transform active:scale-[0.98] ${
              isPremium
                ? 'bg-gradient-to-r from-sky-400 via-purple-500 to-amber-400 shadow-md shadow-sky-950/60 hover:brightness-110'
                : isFail
                ? 'bg-gradient-to-r from-slate-700 via-rose-900/40 to-slate-800 hover:from-rose-500/50'
                : 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 hover:from-amber-500/40 hover:to-slate-700'
            }`}
          >
            <button
              disabled={disabled}
              onClick={() => onSelectChoice(choice)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[11px] backdrop-blur-md text-left transition-colors ${
                isPremium
                  ? 'bg-slate-950/92 text-white hover:bg-slate-900/95'
                  : 'bg-slate-950/90 text-slate-100 hover:bg-slate-900/90'
              }`}
            >
              {/* Левая часть: Иконка предмета и Название */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-900/90 border border-slate-700/60 flex items-center justify-center p-1 shrink-0 shadow-inner">
                  {renderItemIcon(choice.item_icon)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold tracking-wide flex items-center gap-1.5 truncate">
                    <span>{choice.text}</span>
                    {isPremium && (
                      <span className="text-[9px] uppercase font-black px-1.5 py-0.2 rounded-full bg-gradient-to-r from-sky-400 to-purple-400 text-slate-950 shrink-0">
                        Премиум
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isPremium
                      ? 'Спасет героиню и откроет секретную сцену'
                      : isFail
                      ? 'Рискованный и непредсказуемый подход...'
                      : 'Надежное практичное решение'}
                  </p>
                </div>
              </div>

              {/* Правая часть: Стоимость или кнопка рекламы */}
              <div className="shrink-0 ml-2 flex items-center gap-1.5">
                {isPremium ? (
                  <div className="flex items-center gap-1.5">
                    {/* Кнопка за кристаллы */}
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm ${
                        hasEnoughCrystals
                          ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 opacity-80'
                      }`}
                    >
                      <span>{choice.cost}</span>
                      <span>💎</span>
                    </div>

                    {/* Альтернатива: Посмотреть рекламу */}
                    {choice.allow_ad && onWatchAdForChoice && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onWatchAdForChoice(choice);
                        }}
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 px-2 py-0.5 rounded-full cursor-pointer active:scale-95"
                      >
                        <Tv className="w-3 h-3" />
                        <span>Бесплатно</span>
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                    Бесплатно
                  </span>
                )}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};
