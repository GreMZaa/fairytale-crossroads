/**
 * @file SettingsModal.tsx
 * Окно настроек игры в стиле Tile Family (Primer/8.jpg)
 */

import React from 'react';
import { X, Volume2, VolumeX, Smartphone, User } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  userName?: string;
  userId?: number | string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleSound,
  userName = 'Герой',
  userId = '99887766'
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in select-none">
      {/* Карточка настроек (голубой бабл с крестиком) */}
      <div className="relative w-full max-w-xs bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] rounded-[28px] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_3px_rgba(255,255,255,0.2)]">
        {/* Внутренняя панель */}
        <div className="bg-[#FFF9EE] rounded-[24px] p-5 pt-4 text-slate-800 shadow-inner">
          {/* Верхняя строка: Заголовок и красный крестик */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-[#382214] tracking-wide">
              Настройки
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-90 flex items-center justify-center text-white shadow-md transition-all -mr-1 -mt-1"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Список параметров */}
          <div className="space-y-3">
            {/* Звуковые эффекты */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-[#EAD4AA] shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-800">Звуковые эффекты</div>
                  <div className="text-[10px] text-slate-500">{isMuted ? 'Выключен' : 'Включен'}</div>
                </div>
              </div>
              <button
                onClick={onToggleSound}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  !isMuted ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    !isMuted ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Вибрация / Тактильный отклик */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-[#EAD4AA] shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-800">Вибрация (Haptics)</div>
                  <div className="text-[10px] text-slate-500">Telegram Taptic Engine</div>
                </div>
              </div>
              <div className="w-12 h-6 rounded-full p-0.5 bg-emerald-500">
                <div className="w-5 h-5 rounded-full bg-white shadow-md translate-x-6" />
              </div>
            </div>

            {/* Профиль игрока */}
            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-xs text-slate-700">Игрок: {userName}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Telegram ID: {userId}
              </div>
            </div>
          </div>

          {/* Зеленая кнопка Готово */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-[0_4px_12px_rgba(16,185,129,0.4)] border-2 border-white active:scale-95 transition-transform"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;
