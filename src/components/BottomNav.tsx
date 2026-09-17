/**
 * @file BottomNav.tsx
 * Нижняя панель навигации (Dock Menu) в точном стиле Tile Family (Primer/1.jpg)
 * Вкладки: [Магазин 🏪] [Задания 📋] [Дома 🏠] [Команда 👥] [История 📖]
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
    <nav className="relative z-30 w-full bg-gradient-to-b from-[#2A4878] via-[#1D3557] to-[#14253F] border-t-[2.5px] border-[#457B9D] px-2 py-1 shadow-[0_-6px_20px_rgba(0,0,0,0.6)] select-none">
      <div className="flex items-end justify-around max-w-md mx-auto">
        
        {/* 1. Магазин */}
        <button
          onClick={() => onSelectTab('shop')}
          className={`group relative flex flex-col items-center justify-center w-15 py-1 transition-all active:scale-90 ${
            activeTab === 'shop' ? 'scale-105' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-200 flex items-center justify-center shadow-md">
              <span className="text-base">🏪</span>
            </div>
            {shopNotificationCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-b from-rose-500 to-red-700 border-2 border-white flex items-center justify-center text-white text-[9px] font-black shadow-md animate-pulse">
                !
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-sky-100 group-hover:text-amber-300 mt-0.5 tracking-tight">
            Магазин
          </span>
        </button>

        {/* 2. Задания */}
        <button
          onClick={() => onSelectTab('tasks')}
          className={`group relative flex flex-col items-center justify-center w-15 py-1 transition-all active:scale-90 ${
            activeTab === 'tasks' ? 'scale-105' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-blue-600 border border-sky-200 flex items-center justify-center shadow-md">
            <span className="text-base">📋</span>
          </div>
          <span className="text-[10px] font-bold text-sky-100 group-hover:text-amber-300 mt-0.5 tracking-tight">
            Задания
          </span>
        </button>

        {/* 3. Центральная вкладка: ДОМА (Домик с красной крышей Primer/1.jpg) */}
        <button
          onClick={() => onSelectTab('home')}
          className="group relative flex flex-col items-center justify-center -top-2 w-16 transition-all active:scale-95"
        >
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 border-2 border-white shadow-[0_6px_20px_rgba(245,158,11,0.5)] flex items-center justify-center">
            {/* Домик */}
            <span className="text-2xl filter drop-shadow">🏠</span>
          </div>
          <span className="text-[11px] font-black text-amber-300 drop-shadow mt-0.5">
            Дома
          </span>
        </button>

        {/* 4. Команда / Клан */}
        <button
          onClick={() => onSelectTab('clan')}
          className={`group relative flex flex-col items-center justify-center w-15 py-1 transition-all active:scale-90 ${
            activeTab === 'clan' ? 'scale-105' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-emerald-400 to-green-600 border border-emerald-200 flex items-center justify-center shadow-md">
            <span className="text-base">👥</span>
          </div>
          <span className="text-[10px] font-bold text-sky-100 group-hover:text-amber-300 mt-0.5 tracking-tight">
            Команда
          </span>
        </button>

        {/* 5. История (Полароидный альбом глав Primer/44.jpg) */}
        <button
          onClick={() => onSelectTab('story')}
          className={`group relative flex flex-col items-center justify-center w-15 py-1 transition-all active:scale-90 ${
            activeTab === 'story' ? 'scale-105' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-purple-400 to-indigo-600 border border-purple-200 flex items-center justify-center shadow-md">
              <span className="text-base">📖</span>
            </div>
            {storyNotification && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-white flex items-center justify-center text-amber-950 text-[9px] font-black shadow-md">
                ★
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-sky-100 group-hover:text-amber-300 mt-0.5 tracking-tight">
            История
          </span>
        </button>

      </div>
    </nav>
  );
};
export default BottomNav;
