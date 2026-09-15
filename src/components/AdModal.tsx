/**
 * @file AdModal.tsx
 * Модальное окно показа рекламы за вознаграждение (Rewarded Ads: +2 💎)
 * Эмулирует нативный плеер рекламы Telegram Mini App (AdsGram / Yandex)
 */

import React, { useState, useEffect } from 'react';
import { X, Tv, Sparkles, CheckCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (crystalsAdded: number) => void;
  title?: string;
}

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  title = 'Просмотр рекламы за вознаграждение'
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsFinished(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          soundEngine.playMagicChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    soundEngine.playClick();
    onRewardClaimed(2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Верхняя панель рекламы */}
        <div className="w-full px-4 py-2.5 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <Tv className="w-3.5 h-3.5" />
            <span>Telegram Partner Ads</span>
          </div>
          {isFinished ? (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-bold">
              {countdown}с
            </span>
          )}
        </div>

        {/* Тело рекламного ролика (симуляция вирусного трейлера) */}
        <div className="w-full h-56 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {/* Фоновый пульсирующий свет */}
          <div className="absolute w-40 h-40 rounded-full bg-sky-500/20 blur-2xl animate-pulse" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg transform -rotate-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-bold text-base mt-2">
              Сказки: Перекрестки Судеб
            </h4>
            <p className="text-xs text-indigo-200">
              Новые эпизоды «Красавица и Чудовище» уже в разработке!
            </p>
          </div>
        </div>

        {/* Нижний блок вознаграждения */}
        <div className="w-full p-4 bg-slate-950 flex flex-col items-center gap-3">
          <p className="text-xs text-slate-300 font-medium">
            {title}
          </p>

          {isFinished ? (
            <button
              onClick={handleClaim}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 animate-bounce"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Забрать награду (+2 💎)</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Дождитесь окончания таймера для получения 💎
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
