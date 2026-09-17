/**
 * @file NameInputModal.tsx
 * Модальное окно ввода имени игрока в точном стиле Tile Family (Primer/8.jpg)
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NameInputModalProps {
  isOpen: boolean;
  initialName?: string;
  onClose: () => void;
  onSubmitName: (name: string) => void;
}

export const NameInputModal: React.FC<NameInputModalProps> = ({
  isOpen,
  initialName = 'Шороо',
  onClose,
  onSubmitName
}) => {
  const [name, setName] = useState<string>(initialName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundEngine.playClick();
    onSubmitName(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-xs rounded-[32px] bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 border-[3.5px] border-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
        
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gradient-to-b from-rose-500 to-red-700 border-2 border-white flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Заголовок */}
        <h2 className="text-white text-xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-3">
          Введите имя
        </h2>

        {/* Белая внутренняя карточка */}
        <form onSubmit={handleSubmit} className="w-full rounded-2xl bg-gradient-to-b from-[#FFFDF7] to-[#F7ECD4] p-4 border-2 border-[#D4A373] flex flex-col items-center shadow-inner">
          <p className="text-base font-black text-[#5C3A21] mb-3">
            Как тебя зовут?
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наберите свое имя"
            maxLength={18}
            className="w-full py-2.5 px-4 rounded-xl bg-white/90 border-2 border-sky-300 text-center text-base font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner mb-4"
            autoFocus
          />

          {/* Сочная зеленая кнопка "Продолжить" (Primer/8.jpg) */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 border-2 border-emerald-100 text-white font-black text-base shadow-[0_5px_15px_rgba(16,185,129,0.5)] active:scale-95 transition-transform"
          >
            Продолжить
          </button>
        </form>
      </div>
    </div>
  );
};
