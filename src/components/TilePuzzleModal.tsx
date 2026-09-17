/**
 * @file TilePuzzleModal.tsx
 * Настоящая играбельная мини-игра головоломка "Собери 3 плитки" (Tile Family Match-3 Core Gameplay)
 * Приносит золотые звезды ⭐ для восстановления комнаты!
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TilePuzzleModalProps {
  isOpen: boolean;
  levelNumber: number;
  onClose: () => void;
  onWin: (starsWon: number) => void;
}

interface Tile {
  uid: string;
  typeId: number;
  icon: string;
  name: string;
  bgGradient: string;
}

const TILE_TYPES = [
  { typeId: 1, icon: '🍰', name: 'Торт', bgGradient: 'from-pink-100 to-rose-200 border-rose-300' },
  { typeId: 2, icon: '🧸', name: 'Мишка', bgGradient: 'from-amber-100 to-orange-200 border-amber-300' },
  { typeId: 3, icon: '🌸', name: 'Цветок', bgGradient: 'from-fuchsia-100 to-purple-200 border-purple-300' },
  { typeId: 4, icon: '☕', name: 'Чайник', bgGradient: 'from-sky-100 to-blue-200 border-sky-300' },
  { typeId: 5, icon: '⭐', name: 'Звезда', bgGradient: 'from-yellow-100 to-amber-200 border-yellow-300' },
  { typeId: 6, icon: '💎', name: 'Алмаз', bgGradient: 'from-cyan-100 to-teal-200 border-cyan-300' },
];

export const TilePuzzleModal: React.FC<TilePuzzleModalProps> = ({
  isOpen,
  levelNumber,
  onClose,
  onWin
}) => {
  const [boardTiles, setBoardTiles] = useState<Tile[]>([]);
  const [trayTiles, setTrayTiles] = useState<Tile[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [_matchesCount, setMatchesCount] = useState<number>(0);

  // Инициализация уровня с гарантированными тройками плиток
  const initLevel = () => {
    setIsWon(false);
    setIsGameOver(false);
    setTrayTiles([]);
    setMatchesCount(0);

    // В уровне 1 делаем 12 или 15 плиток (4-5 видов по 3 штуки)
    const typesCount = Math.min(6, 3 + levelNumber);
    const selectedTypes = TILE_TYPES.slice(0, typesCount);

    const generated: Tile[] = [];
    selectedTypes.forEach((t, typeIdx) => {
      // Ровно 3 штуки каждого типа для идеального прохождения
      for (let i = 0; i < 3; i++) {
        generated.push({
          uid: `tile_${typeIdx}_${i}_${Math.random()}`,
          typeId: t.typeId,
          icon: t.icon,
          name: t.name,
          bgGradient: t.bgGradient
        });
      }
    });

    // Перемешивание фишек
    for (let i = generated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generated[i], generated[j]] = [generated[j], generated[i]];
    }

    setBoardTiles(generated);
  };

  useEffect(() => {
    if (isOpen) {
      initLevel();
    }
  }, [isOpen, levelNumber]);

  // Клик по плитке на игровом поле
  const handleTileClick = (tile: Tile) => {
    if (trayTiles.length >= 7 || isGameOver || isWon) return;

    soundEngine.playClick();

    // 1. Убираем плитку с доски
    const remainingBoard = boardTiles.filter(t => t.uid !== tile.uid);
    setBoardTiles(remainingBoard);

    // 2. Добавляем в лоток
    const newTray = [...trayTiles, tile];
    setTrayTiles(newTray);

    // 3. Проверяем совпадение троек
    const countByType: Record<number, number> = {};
    newTray.forEach(t => {
      countByType[t.typeId] = (countByType[t.typeId] || 0) + 1;
    });

    const matchingTypeId = Object.keys(countByType).find(k => countByType[Number(k)] >= 3);

    if (matchingTypeId) {
      setTimeout(() => {
        soundEngine.playMagicChime();
        const filteredTray = newTray.filter(t => t.typeId !== Number(matchingTypeId));
        setTrayTiles(filteredTray);
        setMatchesCount(prev => prev + 1);

        // Проверка победы
        if (remainingBoard.length === 0 && filteredTray.length === 0) {
          setTimeout(() => {
            soundEngine.playVictoryFanfare();
            setIsWon(true);
          }, 300);
        }
      }, 250);
    } else if (newTray.length >= 7) {
      setTimeout(() => {
        soundEngine.playPlungerFail();
        setIsGameOver(true);
      }, 350);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#FFFDF7] via-[#FFF8EB] to-[#F7ECD4] border-[3px] border-[#D4A373] p-4.5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col items-center">
        
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full bg-gradient-to-b from-rose-400 to-red-600 border-2 border-white flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Заголовок в стиле деревянной таблички Tile Family */}
        <div className="-mt-8 mb-3 px-6 py-1.5 rounded-full bg-gradient-to-b from-blue-500 via-sky-500 to-blue-700 border-2 border-white shadow-[0_4px_14px_rgba(37,99,235,0.6)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-white font-black text-sm tracking-wider uppercase drop-shadow">
            Уровень {levelNumber}
          </span>
          <span className="bg-amber-400 text-amber-950 font-black text-xs px-2 py-0.5 rounded-full">
            +2 ⭐
          </span>
        </div>

        {/* Подзаголовок задачи */}
        <p className="text-xs font-bold text-[#5C3A21] mb-3 text-center">
          Собери по <span className="text-blue-600 font-black">3 одинаковых</span> фишки в лоток!
        </p>

        {/* Игровое поле с плитками */}
        <div className="w-full min-h-[220px] bg-[#E8D4B5]/50 border-2 border-[#D4A373]/60 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
          {boardTiles.map((tile) => (
            <button
              key={tile.uid}
              onClick={() => handleTileClick(tile)}
              className={`w-13 h-14 rounded-2xl bg-gradient-to-b ${tile.bgGradient} border-2 shadow-[0_5px_0_rgba(180,83,9,0.35),0_8px_15px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center active:translate-y-1 active:shadow-[0_1px_0_rgba(180,83,9,0.35)] transition-all hover:scale-105`}
            >
              <span className="text-2xl drop-shadow">{tile.icon}</span>
              <span className="text-[9px] font-black text-amber-900/80 leading-none mt-0.5">
                {tile.name}
              </span>
            </button>
          ))}
          {boardTiles.length === 0 && !isWon && (
            <div className="text-xs font-bold text-amber-800 animate-pulse">
              Очистка лотка...
            </div>
          )}
        </div>

        {/* Нижний лоток на 7 слотов (Tray) */}
        <div className="w-full mt-4">
          <div className="flex items-center justify-between px-1 mb-1 text-[11px] font-bold text-amber-900/70">
            <span>Лоток сбора:</span>
            <span>{trayTiles.length}/7</span>
          </div>

          <div className="w-full h-16 rounded-2xl bg-[#5C3A21] border-[3px] border-[#D4A373] p-1.5 flex items-center justify-start gap-1 shadow-inner overflow-hidden">
            {[...Array(7)].map((_, idx) => {
              const tile = trayTiles[idx];
              return (
                <div
                  key={idx}
                  className={`flex-1 h-full rounded-xl flex items-center justify-center transition-all ${
                    tile
                      ? `bg-gradient-to-b ${tile.bgGradient} border border-white/80 shadow-md animate-pop-in`
                      : 'bg-[#432814]/60 border border-[#7A4B29]/40'
                  }`}
                >
                  {tile && <span className="text-xl drop-shadow">{tile.icon}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Экран победы */}
        {isWon && (
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-[#FFFDF7]/98 to-[#FDF5E6]/98 flex flex-col items-center justify-center p-6 text-center animate-pop-in z-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-4 border-white flex items-center justify-center shadow-xl mb-3 animate-bounce">
              <Trophy className="w-10 h-10 text-white stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-black text-[#5C3A21] mb-1">
              Уровень пройден!
            </h3>
            <p className="text-xs font-bold text-amber-800 mb-4">
              Отличная работа! Вы заработали звезды для ремонта чердака:
            </p>

            <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-amber-100 border-2 border-amber-300 mb-5 shadow-sm">
              <span className="text-3xl animate-spin" style={{ animationDuration: '3s' }}>⭐</span>
              <span className="text-2xl font-black text-amber-900">+2 Звезды</span>
            </div>

            <button
              onClick={() => {
                onWin(2);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 border-2 border-emerald-100 text-white font-black text-base shadow-[0_6px_20px_rgba(16,185,129,0.5)] active:scale-95 transition-transform"
            >
              Забрать и продолжить ремонт 🔨
            </button>
          </div>
        )}

        {/* Экран проигрыша (Лоток переполнен) */}
        {isGameOver && (
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-[#FFFDF7]/98 to-[#FDF5E6]/98 flex flex-col items-center justify-center p-6 text-center animate-pop-in z-20">
            <div className="w-18 h-18 rounded-full bg-gradient-to-b from-rose-400 to-red-600 border-4 border-white flex items-center justify-center text-3xl shadow-xl mb-3">
              💔
            </div>

            <h3 className="text-lg font-black text-red-900 mb-1">
              Лоток переполнен!
            </h3>
            <p className="text-xs font-bold text-amber-800 mb-5">
              Не удалось собрать 3 одинаковых фишки. Попробуйте еще раз!
            </p>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={initLevel}
                className="w-full py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 border-2 border-white text-white font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Попробовать снова</span>
              </button>

              <button
                onClick={() => {
                  onWin(2);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300 active:scale-95"
              >
                Пропустить за рекламу 📺 (+2 ⭐)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
