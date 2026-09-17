/**
 * @file DialogueBox.tsx
 * Диалоговое окно новеллы с эффектом «Печатной машинки» и пропуском по тапу
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { soundEngine } from '../utils/audio';

interface DialogueBoxProps {
  speaker: string;
  text: string;
  avatar?: string;
  onFinished?: () => void;
  onClickNext?: () => void;
  showNextButton?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  avatar = '/assets/characters/cinderella_cold.png',
  onFinished,
  onClickNext,
  showNextButton = false
}) => {
  const { displayedText, isCompleted, skip } = useTypewriter(text, {
    speed: 22,
    onCharacter: () => soundEngine.playTypewriterClick(),
    onComplete: onFinished
  });

  const handleClick = () => {
    if (!isCompleted) {
      skip();
    } else if (onClickNext) {
      soundEngine.playClick();
      onClickNext();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="relative w-full max-w-md mx-auto cursor-pointer select-none transition-all active:scale-[0.99] animate-pop-in"
    >
      {/* Кнопка "Пропустить ▶▶" */}
      <div className="flex justify-end mb-1 pr-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
            if (isCompleted && onClickNext) onClickNext();
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-amber-200/80 hover:text-amber-100 bg-slate-900/70 hover:bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-amber-500/30 backdrop-blur-sm shadow transition-transform active:scale-95"
        >
          <span>Пропустить</span>
          <span className="text-[9px]">▶▶</span>
        </button>
      </div>

      {/* Основной контейнер диалога */}
      <div className="relative pt-4 pb-3.5 px-4 rounded-2xl bg-gradient-to-b from-[#1C1D24]/95 via-[#16171D]/95 to-[#111217]/95 border-[1.5px] border-amber-500/40 shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between min-h-[92px]">
        
        {/* Верхняя строка: Аватар и Имя персонажа */}
        <div className="flex items-center gap-2.5 -mt-7 mb-2">
          {avatar && (
            <div className="relative w-11 h-11 rounded-full border-2 border-amber-400 bg-amber-950/80 shadow-lg overflow-hidden shrink-0">
              <img
                src={avatar}
                alt={speaker}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Fallback если картинка не найдена
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Имя говорящего */}
          <div className="px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs font-black tracking-wider uppercase shadow-md border border-amber-300">
            {speaker}
          </div>
        </div>

        {/* Текст реплики */}
        <p className="text-[#F1E8D9] text-[13.5px] sm:text-[14.5px] leading-relaxed font-sans font-medium">
          {displayedText}
          {!isCompleted && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-400 animate-pulse align-middle" />
          )}
        </p>

        {/* Нижняя подсказка или кнопка Далее */}
        <div className="mt-2 flex items-center justify-end">
          {showNextButton && isCompleted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onClickNext) {
                  soundEngine.playClick();
                  onClickNext();
                }
              }}
              className="flex items-center gap-1 text-[11px] font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 rounded-full shadow-md active:scale-95 animate-pulse"
            >
              <span>Продолжить</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <span className="text-[10px] text-amber-200/50 font-medium">
              {isCompleted ? 'Нажмите, чтобы продолжить ❯' : 'Нажмите, чтобы показать всё'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
