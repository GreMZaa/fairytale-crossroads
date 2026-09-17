/**
 * @file TopBar.tsx
 * Верхняя панель: Баланс кристаллов 💎, ключей 🔑, индикатор статов и звук
 */

import React from 'react';
import { Volume2, VolumeX, Sparkles, Shield, Heart } from 'lucide-react';
import { UserStats } from '../types/game';

interface TopBarProps {
  crystals: number;
  keys: number;
  stats: UserStats;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
  onOpenShop: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  crystals,
  keys,
  stats,
  isMuted,
  onToggleSound,
  onOpenStats,
  onOpenShop,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 py-2.5 bg-gradient-to-b from-black/90 via-slate-950/75 to-transparent backdrop-blur-sm flex items-center justify-between select-none">
      {/* Левая группа: Ключи (Энергия) и Кристаллы (Премиум) */}
      <div className="flex items-center gap-2">
        {/* Ключи для доступа к главам */}
        <div 
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/90 to-slate-900/90 border border-amber-500/50 rounded-full px-3 py-1 text-xs font-bold text-amber-100 shadow-md"
          title="Ключи для доступа к главам"
        >
          <span className="text-sm drop-shadow">🗝️</span>
          <span>{keys}/2</span>
        </div>

        {/* Кристаллы */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 bg-gradient-to-r from-sky-950/90 to-blue-950/90 border border-sky-400/60 rounded-full px-3 py-1 text-xs font-black text-sky-100 shadow-md active:scale-95 transition-transform hover:brightness-110"
        >
          <span className="text-sm animate-pulse drop-shadow">💎</span>
          <span>{crystals}</span>
          <span className="bg-sky-400/30 text-sky-200 border border-sky-300/40 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black ml-0.5 shadow-sm">
            +
          </span>
        </button>
      </div>

      {/* Правая группа: Статы и Звук */}
      <div className="flex items-center gap-2">
        {/* Кнопка статов героя */}
        <button
          onClick={onOpenStats}
          className="flex items-center gap-2 bg-gradient-to-r from-slate-900/90 to-purple-950/80 border border-amber-500/40 rounded-full px-3 py-1 text-xs font-bold text-amber-200 shadow-md active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.courage}</span>
          </div>
          {stats.light_path > 0 && (
            <div className="flex items-center gap-1 text-sky-300">
              <Sparkles className="w-3 h-3" />
              <span>{stats.light_path}</span>
            </div>
          )}
          {stats.prince_affinity > 0 && (
            <div className="flex items-center gap-1 text-rose-400">
              <Heart className="w-3 h-3 fill-rose-400" />
              <span>{stats.prince_affinity}</span>
            </div>
          )}
        </button>

        {/* Переключатель звука */}
        <button
          onClick={onToggleSound}
          className="w-8 h-8 rounded-full bg-slate-900/90 border border-amber-500/40 flex items-center justify-center text-slate-200 shadow-md active:scale-95 transition-transform"
          aria-label="Звук"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
};
