/**
 * @file StoryAlbumModal.tsx
 * Меню выбора глав в стиле Polaroid Camera ("История" из Primer/43.jpg и 44.jpg)
 */

import React from 'react';
import { X, Lock, Play } from 'lucide-react';

interface StoryAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEpisodeId: string;
  onSelectEpisode: (episodeId: string) => void;
}

export const StoryAlbumModal: React.FC<StoryAlbumModalProps> = ({
  isOpen,
  onClose,
  currentEpisodeId,
  onSelectEpisode
}) => {
  if (!isOpen) return null;

  const chapters = [
    {
      id: 'cinderella-ep1',
      number: 1,
      title: 'Ледяная Башня',
      description: 'Мачеха заперла Золушку в замерзающей башне. Спасите героиню от холода!',
      image: '/assets/backgrounds/attic_ice.png',
      characterAvatar: '/assets/characters/cinderella_cold.png',
      status: 'active' as const, // 'completed' | 'active' | 'locked'
      buttonText: 'Играть'
    },
    {
      id: 'cinderella-ep2',
      number: 2,
      title: 'Огонь на Лестнице',
      description: 'Упавший факел охватил лестницу пламенем! Незнакомец в плаще спешит на помощь.',
      image: '/assets/backgrounds/corridor_fire.png',
      characterAvatar: '/assets/characters/prince_cape.png',
      status: 'active' as const,
      buttonText: 'Помощь'
    },
    {
      id: 'cinderella-ep3',
      number: 3,
      title: 'Королевский Бал',
      description: 'Тайна мачехи раскрыта! Финальный выбор Золушки на балу изменит канон сказки.',
      image: '/assets/backgrounds/attic_ice.png',
      characterAvatar: null,
      status: 'locked' as const,
      buttonText: 'Закрыто'
    }
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A] text-white overflow-hidden animate-fade-in select-none">
      {/* 1. Верхняя часть: Корпус Polaroid Камеры (Primer/44.jpg) */}
      <div className="relative pt-3 pb-2 px-4 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-b-4 border-slate-500 shadow-2xl shrink-0">
        {/* Черная плашка заголовка с крестиком */}
        <div className="flex items-center justify-between bg-slate-900/95 rounded-full px-5 py-2 shadow-inner border border-slate-700/80 mb-2">
          <div className="w-6" /> {/* Spacer */}
          <h2 className="text-base font-black tracking-wider uppercase text-white drop-shadow">
            История
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors active:scale-90"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Элементы ретро-фотоаппарата Polaroid */}
        <div className="flex items-center justify-between px-2 py-1">
          {/* Радужная полоска Polaroid */}
          <div className="flex flex-col gap-0.5">
            <div className="w-10 h-1.5 bg-red-500 rounded-sm" />
            <div className="w-10 h-1.5 bg-amber-400 rounded-sm" />
            <div className="w-10 h-1.5 bg-sky-500 rounded-sm" />
          </div>

          {/* Глянцевый объектив камеры */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border-4 border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center p-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-900 via-blue-950 to-slate-900 border border-sky-400/40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white/40 blur-xs -translate-x-1 -translate-y-1" />
            </div>
          </div>

          {/* Вспышка и глазок видоискателя */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-5 rounded-md bg-slate-100 border border-slate-400 shadow-inner flex items-center justify-center text-[10px]">
              ⚡
            </div>
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-400" />
          </div>
        </div>

        {/* Щель выдачи полароидных фото */}
        <div className="w-full h-2 rounded-full bg-slate-950 border-t border-slate-600 shadow-inner mt-1" />
      </div>

      {/* 2. Прокручиваемый список Полароидных Карточек Глав (Primer/44.jpg) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 no-scrollbar">
        {chapters.map((chapter) => {
          const isCurrent = currentEpisodeId === chapter.id;
          const isLocked = chapter.status === 'locked';

          return (
            <div
              key={chapter.id}
              className={`relative bg-white text-slate-900 rounded-[22px] p-3 shadow-[0_12px_28px_rgba(0,0,0,0.4)] transition-all transform ${
                isCurrent ? 'ring-4 ring-amber-400 scale-[1.01]' : 'hover:scale-[1.01]'
              }`}
            >
              {/* Синий шильдик с номером главы */}
              <div className="flex justify-center -mt-6 mb-2">
                <span className="px-5 py-1 rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 text-white font-black text-xs tracking-wider shadow-md border-2 border-white uppercase">
                  Глава {chapter.number}
                </span>
              </div>

              {/* Полароидная фотография локации */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-100 shadow-inner">
                <img
                  src={chapter.image}
                  alt={chapter.title}
                  className={`w-full h-full object-cover filter brightness-95 ${
                    isLocked ? 'filter grayscale contrast-125 opacity-40' : ''
                  }`}
                />

                {/* Если глава заблокирована — большой замок в центре (как в Primer/44.jpg) */}
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 border-2 border-white shadow-2xl flex items-center justify-center text-slate-800">
                      <Lock className="w-8 h-8 stroke-[2.5]" />
                    </div>
                  </div>
                )}

                {/* Превью персонажа на фото */}
                {!isLocked && chapter.characterAvatar && (
                  <div className="absolute bottom-1 right-3 w-20 h-28 pointer-events-none">
                    <img
                      src={chapter.characterAvatar}
                      alt=""
                      className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                )}
              </div>

              {/* Нижняя полоска с описанием и кнопкой действия */}
              <div className="mt-3 flex items-center justify-between gap-3 px-1">
                {/* Описание */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                    {chapter.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {chapter.description}
                  </p>
                </div>

                {/* Зеленая кнопка действия (как в Primer/44.jpg) */}
                <div className="shrink-0">
                  {isLocked ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-200 border-2 border-slate-300 text-slate-400 font-black text-xs cursor-not-allowed shadow-inner"
                    >
                      Закрыто
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectEpisode(chapter.id);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-[0_4px_12px_rgba(16,185,129,0.5)] border-2 border-white active:scale-95 transition-all animate-pulse"
                    >
                      {chapter.number === 1 ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Играть</span>
                        </>
                      ) : (
                        <>
                          <span>Помощь</span>
                          <span className="text-yellow-300 text-sm animate-bounce">⬇️</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
