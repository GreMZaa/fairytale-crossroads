/**
 * @file StatsModal.tsx
 * Модальное окно статистики персонажа: Путь Света/Тьмы, Отвага, Отношения с Принцем
 */

import React from 'react';
import { X, Shield, Sun, Moon, Heart, Award } from 'lucide-react';
import { UserStats } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  crystals: number;
  keys: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  crystals,
  keys
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 flex flex-col gap-4">
        {/* Хедер модалки */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white tracking-wide">
              Статистика Героини
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Баланс ресурсов */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-sky-950/50 border border-sky-500/30 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-2xl font-black text-sky-300">💎 {crystals}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Кристаллы</span>
          </div>
          <div className="bg-amber-950/50 border border-amber-500/30 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-2xl font-black text-amber-300">🔑 {keys}/2</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Энергия</span>
          </div>
        </div>

        {/* Статы новеллы */}
        <div className="flex flex-col gap-2.5">
          {/* Отвага */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">Отвага</span>
            </div>
            <span className="text-sm font-extrabold text-amber-400">+{stats.courage}</span>
          </div>

          {/* Путь Света */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-semibold text-slate-200">Путь Света</span>
            </div>
            <span className="text-sm font-extrabold text-yellow-300">+{stats.light_path}</span>
          </div>

          {/* Путь Тьмы */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-slate-200">Путь Тьмы</span>
            </div>
            <span className="text-sm font-extrabold text-purple-400">+{stats.dark_path}</span>
          </div>

          {/* Отношения с Принцем */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-xs font-semibold text-slate-200">Симпатия Принца</span>
            </div>
            <span className="text-sm font-extrabold text-rose-400">+{stats.prince_affinity}</span>
          </div>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
