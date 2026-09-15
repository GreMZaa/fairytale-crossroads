/**
 * @file EpisodeFinishedModal.tsx
 * Финальный экран завершения главы с подведением итогов выборов
 */

import React from 'react';
import { Trophy, Sparkles, Heart, Shield, RotateCcw } from 'lucide-react';
import { UserStats } from '../types/game';

interface EpisodeFinishedModalProps {
  isOpen: boolean;
  stats: UserStats;
  rewardCrystals: number;
  onRestart: () => void;
}

export const EpisodeFinishedModal: React.FC<EpisodeFinishedModalProps> = ({
  isOpen,
  stats,
  rewardCrystals,
  onRestart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/50 shadow-2xl p-6 flex flex-col items-center text-center gap-4">
        {/* Иконка кубка */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
          <Trophy className="w-9 h-9 text-slate-950" />
        </div>

        <div>
          <h2 className="text-xl font-black text-white tracking-wide">
            Глава 1 Пройдена!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            «Золушка: Ледяная Башня»
          </p>
        </div>

        {/* Награда за главу */}
        <div className="w-full bg-slate-950/80 border border-sky-500/40 rounded-2xl p-3 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-300 font-medium">Награда за прохождение:</span>
          <span className="text-base font-black text-sky-400 flex items-center gap-1">
            +{rewardCrystals} 💎
          </span>
        </div>

        {/* Накопленные результаты */}
        <div className="w-full flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Отвага
            </span>
            <span className="font-bold text-amber-400">+{stats.courage}</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Путь Света
            </span>
            <span className="font-bold text-sky-400">+{stats.light_path}</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              Симпатия Принца
            </span>
            <span className="font-bold text-rose-400">+{stats.prince_affinity}</span>
          </div>
        </div>

        {/* Кнопка начать заново */}
        <button
          onClick={onRestart}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Пройти главу заново с другим выбором</span>
        </button>
      </div>
    </div>
  );
};
