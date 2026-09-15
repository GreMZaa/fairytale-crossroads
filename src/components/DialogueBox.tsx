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
  onFinished?: () => void;
  onClickNext?: () => void;
  showNextButton?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  onFinished,
  onClickNext,
  showNextButton = false
}) => {
  const { displayedText, isCompleted, skip } = useTypewriter(text, {
    speed: 30,
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
      className="relative w-full max-w-md mx-auto cursor-pointer select-none transition-all active:scale-[0.99]"
    >
      {/* Имя говорящего (Шильдик в стиле Apple HIG / Dark Fantasy) */}
      <div className="absolute -top-3.5 left-4 z-10 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white text-xs font-bold tracking-wider uppercase shadow-md border border-amber-300/40">
        {speaker}
      </div>

      {/* Основная рамка диалога */}
      <div className="relative pt-5 pb-4 px-4 rounded-2xl bg-slate-950/85 border border-slate-700/70 shadow-2xl backdrop-blur-md min-h-[96px] flex flex-col justify-between">
        {/* Текст реплики */}
        <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-sans">
          {displayedText}
          {!isCompleted && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-amber-400 animate-pulse align-middle" />
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
              className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1 rounded-full border border-amber-500/40 animate-bounce"
            >
              <span>Продолжить</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[10px] text-slate-400 opacity-60">
              {isCompleted ? 'Нажмите для перехода' : 'Нажмите, чтобы пропустить'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
