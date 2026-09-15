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
  characterId?: string;
  onFinished?: () => void;
  onClickNext?: () => void;
  showNextButton?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  characterId = 'cinderella',
  onFinished,
  onClickNext,
  showNextButton = false
}) => {
  const { displayedText, isCompleted, skip } = useTypewriter(text, {
    speed: 15,
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

  const isPrince = characterId === 'prince';

  return (
    <div 
      onClick={handleClick}
      className="relative w-full cursor-pointer select-none transition-all active:scale-[0.99] z-30 animate-pop-in"
    >
      {/* Кнопка "Пропустить ▶▶" вверху справа */}
      <div className="flex justify-end mb-1.5 pr-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
            if (isCompleted && onClickNext) onClickNext();
          }}
          className="flex items-center gap-1 text-[11px] font-black text-amber-200/90 hover:text-amber-100 bg-slate-900/80 hover:bg-slate-800/90 px-3 py-1 rounded-full border border-amber-500/40 shadow-md backdrop-blur-md transition-all active:scale-95"
        >
          <span>Пропустить</span>
          <span className="text-[9px]">▶▶</span>
        </button>
      </div>

      {/* Основной Речевой Бабл (Tile Family Style) */}
      <div className="relative bg-[#FFF9EE] border-[2.5px] border-[#EAD4AA] rounded-[24px] p-4 pt-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
        {/* Хвостик речевого бабла */}
        <div className="absolute -top-3.5 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-[#EAD4AA]">
          <div className="absolute top-[2.5px] -left-[8px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[#FFF9EE]" />
        </div>

        {/* Верхняя строка: Аватарка и Табличка с именем */}
        <div className="flex items-center gap-2.5 -mt-8 mb-2">
          {/* Круглый аватар персонажа с эмоцией */}
          <div className="relative w-14 h-14 rounded-full border-[2.5px] border-amber-400 bg-gradient-to-b from-sky-100 to-amber-100 shadow-md overflow-hidden shrink-0">
            <img
              src={isPrince ? '/assets/characters/prince_cape.png' : '/assets/characters/cinderella_cold.png'}
              alt={speaker}
              className="w-full h-full object-cover object-top scale-125 translate-y-1"
            />
          </div>

          {/* Плашка с именем (Яркий синий бейдж как в Tile Family) */}
          <div className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 text-white font-black text-xs tracking-wider shadow-md border border-white/60 uppercase">
            {speaker}
          </div>
        </div>

        {/* Текст реплики с яркими акцентами */}
        <div className="min-h-[46px] flex flex-col justify-between">
          <p className="text-[#382214] text-[13px] sm:text-sm leading-relaxed font-bold font-sans">
            {displayedText}
            {!isCompleted && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-600 animate-pulse align-middle" />
            )}
          </p>

          {/* Нижняя подсказка при завершении */}
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
                className="flex items-center gap-1 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-105 px-3.5 py-1 rounded-full shadow-md active:scale-95 animate-pulse"
              >
                <span>Далее</span>
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
    </div>
  );
};
