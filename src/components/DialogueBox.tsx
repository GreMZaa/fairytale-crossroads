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
      className="relative w-full max-w-md mx-auto cursor-pointer select-none transition-all active:scale-[0.99] animate-pop-in mb-2"
    >
      {/* Кнопка "Пропустить ▶▶" */}
      <div className="flex justify-end mb-1 pr-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
            if (isCompleted && onClickNext) onClickNext();
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 hover:bg-black/80 px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-sm shadow transition-transform active:scale-95"
        >
          <span>Пропустить</span>
          <span className="text-[9px]">▶▶</span>
        </button>
      </div>

      {/* Аутентичный речевой бабл (Tile Family style) */}
      <div className="relative pt-3.5 pb-2.5 px-3.5 rounded-[20px] bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FDF5E6] border-[2px] border-[#EBD7B0] shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex flex-col justify-between">
        
        {/* Хвостик речевого бабла вверх к персонажу */}
        <div className="absolute -top-2.5 left-10 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[10px] border-b-[#EBD7B0]">
          <div className="absolute top-[2px] -left-[6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#FFFDF8]" />
        </div>

        {/* Верхняя строка: Аватар и Плашка с именем */}
        <div className="flex items-center gap-2 -mt-6 mb-1.5">
          {avatar && (
            <div className="relative w-10 h-10 rounded-full border-2 border-amber-400 bg-amber-100 shadow-md overflow-hidden shrink-0">
              <img
                src={avatar}
                alt={speaker}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Плашка с именем персонажа */}
          <div className="px-3.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white text-[11px] font-black tracking-wider uppercase shadow-md border border-white/70">
            {speaker}
          </div>
        </div>

        {/* Текст реплики темно-шоколадным цветом */}
        <p className="text-[#3D2614] text-[13px] sm:text-[14px] leading-snug font-sans font-bold">
          {displayedText}
          {!isCompleted && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-600 animate-pulse align-middle" />
          )}
        </p>

        {/* Нижняя подсказка или кнопка Далее */}
        <div className="mt-1 flex items-center justify-end">
          {showNextButton && isCompleted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onClickNext) {
                  soundEngine.playClick();
                  onClickNext();
                }
              }}
              className="flex items-center gap-1 text-[11px] font-black text-white bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-0.5 rounded-full shadow-md active:scale-95 animate-pulse"
            >
              <span>Продолжить</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <span className="text-[10px] text-amber-900/60 font-semibold">
              {isCompleted ? 'Нажмите, чтобы продолжить ❯' : 'Нажмите, чтобы показать всё'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
