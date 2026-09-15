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
    <header className="fixed top-0 left-0 right-0 z-40 px-3 py-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-xs flex items-center justify-between select-none">
      {/* Левая группа: Ключи и Кристаллы */}
      <div className="flex items-center gap-2">
        {/* Ключи (Энергия) */}
        <div 
          className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/60 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm"
          title="Ключи для доступа к главам"
        >
          <span className="text-amber-400">🔑</span>
          <span className="text-slate-100">{keys}/2</span>
        </div>

        {/* Кристаллы (Премиум) */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 bg-sky-950/80 border border-sky-500/50 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm active:scale-95 transition-transform"
        >
          <span className="text-sky-400 animate-pulse">💎</span>
          <span className="text-sky-200">{crystals}</span>
          <span className="bg-sky-500/30 text-sky-300 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-extrabold ml-0.5">
            +
          </span>
        </button>
      </div>

      {/* Правая группа: Статы и Звук */}
      <div className="flex items-center gap-2">
        {/* Кнопка статов */}
        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 bg-purple-950/70 border border-purple-500/40 rounded-full px-2.5 py-1 text-xs font-medium text-purple-200 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.courage}</span>
          </div>
          {stats.light_path > 0 && (
            <div className="flex items-center gap-0.5 text-sky-300">
              <Sparkles className="w-3 h-3" />
              <span>{stats.light_path}</span>
            </div>
          )}
          {stats.prince_affinity > 0 && (
            <div className="flex items-center gap-0.5 text-rose-400">
              <Heart className="w-3 h-3 fill-rose-400" />
              <span>{stats.prince_affinity}</span>
            </div>
          )}
        </button>

        {/* Переключатель звука */}
        <button
          onClick={onToggleSound}
          className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-300 active:scale-95 transition-transform"
          aria-label="Звук"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>
      </div>
    </header>
  );
};
