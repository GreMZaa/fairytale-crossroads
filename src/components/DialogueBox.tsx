/**
 * @file DialogueBox.tsx
 * Речевой бабл диалогов в аутентичном стиле Tile Family (Primer/1.jpg - 7.jpg)
 * Теплый кремовый фон, темный шоколадный шрифт, яркая синяя или красная плашка имени персонажа.
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { soundEngine } from '../utils/audio';

interface DialogueBoxProps {
  speaker: string;
  text: string;
  avatar?: string;
  ribbonColor?: 'blue' | 'red' | 'gold';
  onFinished?: () => void;
  onClickNext?: () => void;
  showNextButton?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  avatar,
  ribbonColor = 'blue',
  onFinished,
  onClickNext,
  showNextButton = true
}) => {
  const { displayedText, isCompleted, skip } = useTypewriter(text, {
    speed: 18,
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

  const getRibbonGradient = () => {
    if (ribbonColor === 'red') {
      return 'from-rose-500 via-red-500 to-red-700';
    }
    if (ribbonColor === 'gold') {
      return 'from-amber-400 via-amber-500 to-amber-600 text-amber-950';
    }
    return 'from-blue-500 via-sky-500 to-blue-600 text-white';
  };

  return (
    <div 
      onClick={handleClick}
      className="relative w-full cursor-pointer select-none transition-all active:scale-[0.99] z-30 animate-pop-in px-1"
    >
      {/* Кнопка "Пропустить ▶▶" (Primer/14.jpg) */}
      <div className="flex justify-end mb-1 pr-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
            if (isCompleted && onClickNext) onClickNext();
          }}
          className="flex items-center gap-1 text-[11px] font-black text-white bg-black/60 hover:bg-black/80 px-3 py-0.5 rounded-full border border-white/40 shadow backdrop-blur-sm transition-transform active:scale-95"
        >
          <span>Пропустить</span>
          <span className="text-[10px]">▶▶</span>
        </button>
      </div>

      {/* Основной Речевой Бабл (Tile Family: Primer/2.jpg) */}
      <div className="relative bg-gradient-to-b from-[#FFFDF7] via-[#FFF9EE] to-[#FDF5E6] border-[2.5px] border-[#EAD4AA] rounded-[24px] p-3.5 pt-3 shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
        
        {/* Хвостик речевого бабла */}
        <div className="absolute -top-3 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[#EAD4AA]">
          <div className="absolute top-[2px] -left-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[10px] border-b-[#FFFDF7]" />
        </div>

        {/* Верхняя строка: Аватарка и Плашка с именем (Primer/2.jpg) */}
        <div className="flex items-center gap-2 -mt-7 mb-2">
          {avatar && (
            <div className="relative w-12 h-12 rounded-full border-2 border-amber-300 bg-amber-100 shadow-md overflow-hidden shrink-0">
              <img
                src={avatar}
                alt={speaker}
                className="w-full h-full object-cover object-top scale-130"
              />
            </div>
          )}

          {/* Плашка с именем персонажа */}
          <div className={`px-4 py-0.5 rounded-full bg-gradient-to-r ${getRibbonGradient()} font-black text-xs tracking-wider shadow-md border border-white/80 uppercase`}>
            {speaker}
          </div>
        </div>

        {/* Текст реплики теплыми шоколадными буквами */}
        <div className="min-h-[42px] flex flex-col justify-between">
          <p className="text-[#4A2E18] text-[13px] sm:text-[14px] leading-snug font-bold font-sans">
            {displayedText}
            {!isCompleted && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-600 animate-pulse align-middle" />
            )}
          </p>

          {/* Нижняя кнопка «Далее» */}
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
                className="flex items-center gap-1 text-[11px] font-black text-white bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-0.5 rounded-full shadow active:scale-95 animate-pulse"
              >
                <span>Далее</span>
                <ChevronRight className="w-3 h-3 stroke-[3]" />
              </button>
            ) : (
              <span className="text-[10px] text-amber-900/60 font-semibold">
                {isCompleted ? 'Нажмите, чтобы продолжить ❯' : 'Нажмите, чтобы показать всё'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
