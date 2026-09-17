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
    <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 z-30 select-none">
      {choices.map((choice) => {
        const isPremium = choice.type === 'premium';
        const isFail = choice.type === 'fail';
        const hasEnoughCrystals = userCrystals >= choice.cost;

        return (
          <div
            key={choice.id}
            className={`relative rounded-2xl p-0.5 transition-all transform active:scale-95 ${
              isPremium
                ? 'bg-gradient-to-b from-amber-300 via-sky-400 to-amber-500 shadow-[0_6px_20px_rgba(56,189,248,0.4)] hover:brightness-110'
                : isFail
                ? 'bg-gradient-to-b from-stone-600 via-rose-700 to-stone-800 shadow-md'
                : 'bg-gradient-to-b from-amber-400/80 via-amber-600 to-stone-800 shadow-md'
            }`}
          >
            <button
              disabled={disabled}
              onClick={() => onSelectChoice(choice)}
              className={`w-full h-full min-h-[105px] flex flex-col items-center justify-between p-2 rounded-[14px] text-center transition-colors ${
                isPremium
                  ? 'bg-gradient-to-b from-[#162032]/95 to-[#0D131F]/95 text-white hover:bg-slate-900/95'
                  : isFail
                  ? 'bg-gradient-to-b from-[#251A1A]/95 to-[#141214]/95 text-stone-200 hover:bg-stone-900/95'
                  : 'bg-gradient-to-b from-[#262019]/95 to-[#151210]/95 text-amber-50 hover:bg-amber-950/90'
              }`}
            >
              {/* Верхняя иконка */}
              <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 shrink-0 shadow-inner">
                {renderItemIcon(choice.item_icon)}
              </div>

              {/* Название */}
              <div className="my-1">
                <h4 className="font-bold text-[11px] sm:text-xs leading-tight line-clamp-2">
                  {choice.text}
                </h4>
              </div>

              {/* Плашка стоимости / бейдж */}
              <div className="w-full mt-auto">
                {isPremium ? (
                  hasEnoughCrystals ? (
                    <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-[11px] py-1 rounded-full shadow-md border border-sky-300/50">
                      <span>💎</span>
                      <span>{choice.cost}</span>
                    </div>
                  ) : choice.allow_ad && onWatchAdForChoice ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onWatchAdForChoice(choice);
                      }}
                      className="flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-black text-[10px] py-1 rounded-full shadow border border-emerald-300 active:scale-95"
                    >
                      <Tv className="w-3 h-3 stroke-[2.5]" />
                      <span>Бесплатно</span>
                    </span>
                  ) : (
                    <div className="flex items-center justify-center gap-1 bg-slate-800 text-slate-400 font-bold text-[11px] py-1 rounded-full border border-slate-600">
                      <span>💎</span>
                      <span>{choice.cost}</span>
                    </div>
                  )
                ) : isFail ? (
                  <span className="block text-[10px] font-bold text-rose-300/90 bg-rose-950/50 py-0.5 rounded-full border border-rose-500/30">
                    Риск
                  </span>
                ) : (
                  <span className="block text-[10px] font-bold text-amber-200/80 bg-amber-950/50 py-0.5 rounded-full border border-amber-500/30">
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
