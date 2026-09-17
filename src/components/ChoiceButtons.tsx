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
                ? 'bg-gradient-to-r from-amber-400 via-sky-400 to-amber-300 shadow-[0_4px_18px_rgba(56,189,248,0.35)] hover:brightness-110'
                : isFail
                ? 'bg-gradient-to-r from-stone-600 via-rose-700/60 to-stone-700 shadow-md'
                : 'bg-gradient-to-r from-amber-700/70 via-amber-500/70 to-stone-700 shadow-md'
            }`}
          >
            <button
              disabled={disabled}
              onClick={() => onSelectChoice(choice)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[14px] backdrop-blur-md text-left transition-colors ${
                isPremium
                  ? 'bg-gradient-to-r from-[#111928]/95 to-[#1E293B]/95 text-white hover:bg-slate-900/95'
                  : isFail
                  ? 'bg-gradient-to-r from-[#1E1919]/95 to-[#1A1A22]/95 text-stone-200 hover:bg-stone-900/95'
                  : 'bg-gradient-to-r from-[#1E1B18]/95 to-[#24201A]/95 text-amber-50 hover:bg-amber-950/90'
              }`}
            >
              {/* Левая часть: Иконка предмета и Название */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-950/70 to-slate-950/90 border border-amber-500/40 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                  {renderItemIcon(choice.item_icon)}
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base leading-tight drop-shadow-sm">
                    {choice.text}
                  </h4>
                  {isPremium && (
                    <p className="text-[11px] text-sky-300 font-semibold flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Магическое решение</span>
                    </p>
                  )}
                  {isFail && (
                    <p className="text-[11px] text-rose-300/80 font-medium mt-0.5">
                      Рискованный поступок
                    </p>
                  )}
                </div>
              </div>

              {/* Правая часть: Цена или Кнопка Рекламы */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {isPremium ? (
                  hasEnoughCrystals ? (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-md border border-sky-300/50">
                      <span>💎</span>
                      <span>{choice.cost}</span>
                    </div>
                  ) : choice.allow_ad && onWatchAdForChoice ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onWatchAdForChoice(choice);
                      }}
                      className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-[11px] px-2.5 py-1.5 rounded-full shadow-md border border-emerald-300/60 active:scale-95 transition-transform"
                    >
                      <Tv className="w-3 h-3 stroke-[2.5]" />
                      <span>Бесплатно</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 bg-slate-800 text-slate-400 font-bold text-xs px-2.5 py-1 rounded-full border border-slate-600">
                      <span>💎</span>
                      <span>{choice.cost}</span>
                    </div>
                  )
                ) : (
                  <span className="text-[11px] font-bold text-amber-200/60 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/20">
                    Обычный
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
