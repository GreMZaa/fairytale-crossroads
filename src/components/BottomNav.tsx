/**
 * @file BottomNav.tsx
 * Нижняя панель навигации (Dock Menu) в точном стиле Tile Family (Primer/1.jpg)
 * Вкладки: [Магазин 🛍️] [Задания 📋] [Дома 🏠] [Клан 👥] [История 📖]
 */

import React from 'react';

export type NavTabId = 'shop' | 'tasks' | 'home' | 'clan' | 'story';

interface BottomNavProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  shopNotificationCount?: number;
  storyNotification?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  shopNotificationCount = 1,
  storyNotification = true,
}) => {
  return (
    <nav className="relative z-30 w-full bg-gradient-to-b from-[#1E2E4A] via-[#162238] to-[#0F172A] border-t-2 border-[#2E4770] px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.8)] select-none">
      <div className="flex items-end justify-around max-w-md mx-auto">
        {/* 1. Магазин */}
        <button
          onClick={() => onSelectTab('shop')}
          className={`group relative flex flex-col items-center justify-center w-16 py-1 transition-all active:scale-90 ${
            activeTab === 'shop' ? 'scale-105' : 'opacity-80 hover:opacity-100'
          }`}
        >
          {/* Иконка лавки/магазина */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Тент магазина */}
            <div className="w-9 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] border border-amber-400/50 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-full h-3 bg-gradient-to-r from-red-500 via-amber-200 to-red-500 flex justify-between px-0.5" />
              <span className="text-sm">🏪</span>
            </div>

            {/* Красный бейдж восклицательного знака */}
            {shopNotificationCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-b from-red-500 to-rose-700 border-1.5 border-white flex items-center justify-center text-white text-[9px] font-black shadow-md animate-pulse">
                !
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-300 group-hover:text-amber-300 mt-0.5 tracking-tight">
            Магазин
          </span>
        </button>

        {/* 2. Задания */}
        <button
          onClick={() => onSelectTab('tasks')}
          className={`group relative flex flex-col items-center justify-center w-16 py-1 transition-all active:scale-90 ${
            activeTab === 'tasks' ? 'scale-105' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Календарик с цифрами 1 2 3 */}
            <div className="w-9 h-8 bg-gradient-to-b from-sky-600 to-blue-800 rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] border border-sky-400/50 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-full h-2 bg-red-600 flex justify-around px-1">
                <div className="w-1 h-1 rounded-full bg-white" />
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
              <span className="text-[11px] font-black text-amber-300 tracking-wider">1 2 3</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-300 group-hover:text-sky-300 mt-0.5 tracking-tight">
            Задания
          </span>
        </button>

        {/* 3. Дома (Центральная главная кнопка — приподнятый домик) */}
        <button
          onClick={() => onSelectTab('home')}
          className="group relative flex flex-col items-center justify-center w-18 -mt-5 transition-all active:scale-95"
        >
          {/* Светящаяся подложка под домиком */}
          <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-[0_6px_18px_rgba(245,158,11,0.5),0_0_0_2px_rgba(255,255,255,0.2)]">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#8B2500] via-[#A0300A] to-[#6E1A00] flex flex-col items-center justify-center border-t border-amber-300/40">
              {/* Крыша домика */}
              <div className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                🏠
              </div>
            </div>
          </div>
          <span className="text-[11px] font-black text-amber-300 drop-shadow mt-1 tracking-wide">
            Дома
          </span>
        </button>

        {/* 4. Клан / Друзья */}
        <button
          onClick={() => onSelectTab('clan')}
          className={`group relative flex flex-col items-center justify-center w-16 py-1 transition-all active:scale-90 ${
            activeTab === 'clan' ? 'scale-105' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Щит клана */}
            <div className="w-9 h-8 bg-gradient-to-b from-amber-700 to-yellow-900 rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] border border-amber-500/50 flex items-center justify-center">
              <span className="text-base">👥</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-300 group-hover:text-amber-300 mt-0.5 tracking-tight">
            Клан
          </span>
        </button>

        {/* 5. История (Открывает полароидный альбом) */}
        <button
          onClick={() => onSelectTab('story')}
          className={`group relative flex flex-col items-center justify-center w-16 py-1 transition-all active:scale-90 ${
            activeTab === 'story' ? 'scale-105' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Книга историй со звездой-закладкой */}
            <div className="w-9 h-8 bg-gradient-to-b from-rose-700 via-red-800 to-rose-950 rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)] border border-rose-400/50 flex items-center justify-center">
              <span className="text-base">📖</span>
            </div>

            {/* Золотая звездочка индикатор новинки */}
            {storyNotification && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border border-white flex items-center justify-center text-[10px] shadow animate-bounce">
                ⭐
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-300 group-hover:text-amber-300 mt-0.5 tracking-tight">
            История
          </span>
        </button>
      </div>
    </nav>
  );
};
export default BottomNav;
