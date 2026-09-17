/**
 * @file VictoryModal.tsx
 * Финальный экран победы и открытия сундука с сокровищами в стиле Tile Family (Primer/40.jpg & 41.jpg)
 */

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onRestart
}) => {
  const [isChestOpened, setIsChestOpened] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleOpenChest = () => {
    soundEngine.playMagicChime();
    soundEngine.playVictoryFanfare();
    setIsChestOpened(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      {!isChestOpened ? (
        /* Экран 1: Шарики и лента "Отлично сделано!" (Primer/40.jpg) */
        <div 
          onClick={handleOpenChest}
          className="relative w-full max-w-xs flex flex-col items-center cursor-pointer animate-pop-in text-center"
        >
          {/* Летающие шарики */}
          <div className="flex justify-around w-full mb-2 pointer-events-none">
            <span className="text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎈</span>
            <span className="text-6xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎉</span>
            <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
          </div>

          {/* Картинка отремонтированной уютной комнаты */}
          <div className="relative w-52 h-52 rounded-full p-2 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-4 border-white shadow-[0_15px_40px_rgba(245,158,11,0.6)] overflow-hidden mb-4">
            <img
              src="/assets/primer/40.jpg"
              alt="Уютная комната"
              className="w-full h-full object-cover object-center scale-115"
            />
          </div>

          {/* Золотая лента "Отлично сделано!" (Primer/40.jpg) */}
          <div className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 border-2 border-white shadow-[0_8px_25px_rgba(245,158,11,0.7)] text-white font-black text-xl tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-4 animate-pulse">
            Отлично сделано!
          </div>

          <p className="text-white text-sm font-black drop-shadow animate-pulse">
            Нажмите, чтобы получить награду ✨
          </p>
        </div>
      ) : (
        /* Экран 2: Золотой сундук с наградами (Primer/41.jpg) */
        <div className="relative w-full max-w-xs rounded-[32px] bg-gradient-to-b from-[#FFFDF7] via-[#FFF8EB] to-[#F7ECD4] border-[3.5px] border-[#D4A373] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col items-center text-center animate-pop-in">
          
          <h2 className="text-2xl font-black text-[#5C3A21] mb-1">
            Поздравляем! 🎉
          </h2>
          <p className="text-xs font-bold text-amber-800 mb-4">
            Вы спасли Аманду и её детей от зимней стужи!
          </p>

          {/* Сияющий сундук сокровищ */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-4 border-white flex items-center justify-center text-5xl shadow-2xl mb-4 animate-bounce">
            🎁
          </div>

          {/* Награды */}
          <div className="w-full bg-amber-100 border border-amber-300 rounded-2xl p-3 mb-5 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="text-2xl">💎</span>
              <span className="text-sm font-black text-amber-950">+100</span>
              <span className="text-[10px] text-amber-800">Кристаллы</span>
            </div>
            <div className="w-[1px] h-8 bg-amber-300" />
            <div className="flex flex-col items-center">
              <span className="text-2xl">🪙</span>
              <span className="text-sm font-black text-amber-950">+500</span>
              <span className="text-[10px] text-amber-800">Монеты</span>
            </div>
            <div className="w-[1px] h-8 bg-amber-300" />
            <div className="flex flex-col items-center">
              <span className="text-2xl">⭐</span>
              <span className="text-sm font-black text-amber-950">+5</span>
              <span className="text-[10px] text-amber-800">Звезды</span>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 border-2 border-emerald-100 text-white font-black text-base shadow-[0_5px_15px_rgba(16,185,129,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Играть снова</span>
          </button>
        </div>
      )}
    </div>
  );
};
