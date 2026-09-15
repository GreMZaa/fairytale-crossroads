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
  disabled?: boolean;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  choices,
  userCrystals,
  onSelectChoice,
  onWatchAdForChoice,
  disabled = false
}) => {
  const renderItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'boards':
        return <BoardsIcon className="w-8 h-8" />;
      case 'plunger':
        return (
          <img 
            src="/assets/props/plunger.png" 
            alt="Вантуз" 
            className="w-10 h-10 object-contain drop-shadow" 
          />
        );
      case 'magic_shawl':
        return (
          <img 
            src="/assets/props/magic_shawl.jpeg" 
            alt="Магическая шаль" 
            className="w-10 h-10 object-cover rounded-lg drop-shadow" 
          />
        );
      case 'bucket':
        return <BucketIcon className="w-8 h-8" />;
      case 'fan':
        return <FanIcon className="w-8 h-8" />;
      case 'ice_amulet':
        return (
          <img 
            src="/assets/props/ice_amulet.jpeg" 
            alt="Ледяной амулет" 
            className="w-10 h-10 object-cover rounded-lg drop-shadow" 
          />
        );
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-2.5 z-30 select-none">
      {choices.map((choice) => {
        const isPremium = choice.type === 'premium';
        const isFail = choice.type === 'fail';
        const hasEnoughCrystals = userCrystals >= choice.cost;

        return (
          <div
            key={choice.id}
            className={`relative group rounded-2xl p-0.5 transition-all transform active:scale-[0.98] ${
              isPremium
                ? 'bg-gradient-to-r from-sky-500 via-purple-500 to-amber-400 shadow-lg shadow-sky-950/50 hover:brightness-110'
                : isFail
                ? 'bg-gradient-to-r from-slate-700 via-rose-900/50 to-slate-800'
                : 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800'
            }`}
          >
            <button
              disabled={disabled}
              onClick={() => onSelectChoice(choice)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] backdrop-blur-md text-left transition-colors ${
                isPremium
                  ? 'bg-slate-950/90 text-white hover:bg-slate-900/90'
                  : 'bg-slate-950/85 text-slate-100 hover:bg-slate-900/90'
              }`}
            >
              {/* Левая часть: Иконка предмета и Название */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center p-1 shrink-0 shadow-inner">
                  {renderItemIcon(choice.item_icon)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold tracking-wide flex items-center gap-1.5">
                    {choice.text}
                    {isPremium && (
                      <span className="text-[10px] uppercase font-black bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                        ★ Премиум
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {isPremium
                      ? 'Решает проблему с триумфом и открывает секретную сцену'
                      : isFail
                      ? 'Рискованный и нестандартный подход...'
                      : 'Надежное практичное решение'}
                  </p>
                </div>
              </div>

              {/* Правая часть: Стоимость или кнопка рекламы */}
              <div className="shrink-0 ml-2 flex items-center gap-1.5">
                {isPremium ? (
                  <div className="flex flex-col items-end gap-1">
                    {/* Кнопка за кристаллы */}
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm ${
                        hasEnoughCrystals
                          ? 'bg-sky-500 text-slate-950'
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
                        className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 px-2 py-0.5 rounded-full cursor-pointer active:scale-95"
                      >
                        <Tv className="w-3 h-3" />
                        <span>Бесплатно 📺</span>
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold px-2 py-1 rounded-full bg-slate-900 border border-slate-800">
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
