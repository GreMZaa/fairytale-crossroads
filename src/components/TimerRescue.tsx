/**
 * @file TimerRescue.tsx
 * Механика ожидания (Wait Mechanics / Ad-like Puzzle)
 * Позволяет ждать таймер или мгновенно ускорить побег за рекламу или кристаллы
 */

import React, { useState, useEffect } from 'react';
import { Clock, Tv, Sparkles } from 'lucide-react';
import { TimerRescue as TimerRescueType } from '../types/game';

interface TimerRescueProps {
  timerData: TimerRescueType;
  userCrystals: number;
  onSpeedupAd: () => void;
  onSpeedupCrystals: () => void;
  onTimerFinished: () => void;
}

export const TimerRescue: React.FC<TimerRescueProps> = ({
  timerData,
  userCrystals,
  onSpeedupAd,
  onSpeedupCrystals,
  onTimerFinished
}) => {
  const [timeLeft, setTimeLeft] = useState(timerData.duration_seconds || 600);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimerFinished();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimerFinished();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimerFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, 100 - (timeLeft / timerData.duration_seconds) * 100));

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-3xl bg-slate-950/90 border border-amber-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-4 z-30 select-none animate-fade-in">
      {/* Заголовок таймера */}
      <div className="flex items-center gap-2 text-amber-400">
        <Clock className="w-5 h-5 animate-spin-slow" />
        <h3 className="font-bold text-base tracking-wide text-amber-200">
          {timerData.title}
        </h3>
      </div>

      {/* Цифровой обратный отсчет */}
      <div className="relative w-full flex flex-col items-center">
        <div className="text-4xl font-extrabold tracking-wider font-mono bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
          {formatTime(timeLeft)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Золушка методично выбивает тяжелый засов двери...
        </p>

        {/* Индикатор прогресса */}
        <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden border border-slate-700">
          <div 
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-1000 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Кнопки ускорения */}
      <div className="w-full flex flex-col gap-2 pt-2">
        {/* Ускорение за рекламу (Бесплатно) */}
        <button
          onClick={onSpeedupAd}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-transform"
        >
          <Tv className="w-4 h-4" />
          <span>Ускорить бесплатно (Реклама ⏩)</span>
        </button>

        {/* Мгновенное открытие за 5 кристаллов */}
        <button
          onClick={onSpeedupCrystals}
          disabled={userCrystals < timerData.speedup_crystal_cost}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-bold text-xs border transition-all active:scale-[0.98] ${
            userCrystals >= timerData.speedup_crystal_cost
              ? 'bg-sky-950/80 border-sky-500/50 text-sky-200 hover:bg-sky-900/80 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Открыть сейчас за {timerData.speedup_crystal_cost} 💎</span>
        </button>
      </div>
    </div>
  );
};
