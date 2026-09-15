/**
 * @file VisualAssets.tsx
 * Векторные художественные ассеты персонажей, предметов и фонов
 * Реализованы по спецификации "Промпты для Графики.md"
 */

import React from 'react';

// Иконка досок и гвоздей
export const BoardsIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="16" width="44" height="12" rx="2" fill="#854d0e" stroke="#ca8a04" strokeWidth="2" transform="rotate(-6 32 22)" />
    <rect x="8" y="32" width="46" height="12" rx="2" fill="#713f12" stroke="#a16207" strokeWidth="2" transform="rotate(4 31 38)" />
    <circle cx="16" cy="22" r="2" fill="#cbd5e1" />
    <circle cx="48" cy="22" r="2" fill="#cbd5e1" />
    <circle cx="14" cy="38" r="2" fill="#cbd5e1" />
    <circle cx="50" cy="38" r="2" fill="#cbd5e1" />
  </svg>
);

// Иконка Вантуза (Абсурдный предмет)
export const PlungerIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Деревянная рукоять */}
    <rect x="29" y="8" width="6" height="34" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
    {/* Резиновый колпак */}
    <path d="M14 54C14 44 22 42 32 42C42 42 50 44 50 54C50 56 48 57 32 57C16 57 14 56 14 54Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
    <ellipse cx="32" cy="42" rx="7" ry="3" fill="#ef4444" />
    <ellipse cx="25" cy="47" rx="3" ry="1.5" fill="#fca5a5" opacity="0.6" />
  </svg>
);

// Иконка Магической Шали Крестной (Премиум)
export const MagicShawlIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shawlGrad" x1="10" y1="14" x2="54" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.5" stopColor="#818cf8" />
        <stop offset="1" stopColor="#c084fc" />
      </linearGradient>
      <filter id="magicGlow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path
      d="M12 24C18 16 46 16 52 24C54 36 42 52 32 52C22 52 10 36 12 24Z"
      fill="url(#shawlGrad)"
      filter="url(#magicGlow)"
    />
    <path d="M18 26C24 38 40 38 46 26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
    {/* Искры */}
    <circle cx="20" cy="18" r="2" fill="#ffffff" />
    <circle cx="44" cy="18" r="1.5" fill="#fef08a" />
    <circle cx="32" cy="40" r="2" fill="#ffffff" />
  </svg>
);

// Иконка Ведра с водой
export const BucketIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 22L20 54C20.5 56.5 24 58 32 58C40 58 43.5 56.5 44 54L48 22H16Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
    <ellipse cx="32" cy="22" rx="16" ry="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
    <path d="M16 22C16 12 48 12 48 22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Иконка Веера
export const FanIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M32 52L12 30C22 18 42 18 52 30L32 52Z" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
    <line x1="32" y1="52" x2="22" y2="24" stroke="#fecdd3" strokeWidth="1.5" />
    <line x1="32" y1="52" x2="32" y2="21" stroke="#fecdd3" strokeWidth="1.5" />
    <line x1="32" y1="52" x2="42" y2="24" stroke="#fecdd3" strokeWidth="1.5" />
    <circle cx="32" cy="52" r="3" fill="#e11d48" />
  </svg>
);

// Иконка Ледяного Амулета (Премиум)
export const IceAmuletIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="crystalGrad" x1="16" y1="16" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e0f2fe" />
        <stop offset="0.5" stopColor="#38bdf8" />
        <stop offset="1" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <path d="M32 8L16 28L32 58L48 28L32 8Z" fill="url(#crystalGrad)" stroke="#bae6fd" strokeWidth="2" />
    <path d="M32 8L26 28L32 58L38 28L32 8Z" fill="#7dd3fc" opacity="0.7" />
    <circle cx="32" cy="12" r="3" stroke="#facc15" strokeWidth="2" fill="none" />
  </svg>
);

// Аватар Золушки (выразительный 2D спрайт)
export const CinderellaAvatar: React.FC<{ emotion?: string; className?: string }> = ({ emotion = 'shivering', className = 'w-48 h-64' }) => {
  const isCold = emotion === 'shivering';
  const isHappy = emotion === 'happy' || emotion === 'triumphant';

  return (
    <svg viewBox="0 0 200 300" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hairGrad" x1="70" y1="40" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.8" stopColor="#eab308" />
          <stop offset="1" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="dressGrad" x1="50" y1="160" x2="150" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor={isHappy ? '#38bdf8' : '#64748b'} />
          <stop offset="1" stopColor={isHappy ? '#1e40af' : '#334155'} />
        </linearGradient>
      </defs>

      {/* Волосы сзади */}
      <path d="M60 90C45 130 50 200 70 230C80 180 80 140 85 100Z" fill="url(#hairGrad)" />
      <path d="M140 90C155 130 150 200 130 230C120 180 120 140 115 100Z" fill="url(#hairGrad)" />

      {/* Платье */}
      <path d="M75 160L45 295C70 300 130 300 155 295L125 160H75Z" fill="url(#dressGrad)" />
      {/* Рваный подол / сажа */}
      {!isHappy && (
        <path d="M45 295L60 280L75 297L90 282L110 298L130 283L155 295C130 302 70 302 45 295Z" fill="#1e293b" />
      )}

      {/* Тело и шея */}
      <path d="M88 130L85 170H115L112 130Z" fill="#fde68a" />

      {/* Лицо */}
      <path d="M72 80C72 50 128 50 128 80C128 115 116 135 100 135C84 135 72 115 72 80Z" fill="#fef3c7" />

      {/* Глаза */}
      <ellipse cx="88" cy="85" rx="5" ry="7" fill="#0284c7" />
      <ellipse cx="112" cy="85" rx="5" ry="7" fill="#0284c7" />
      <circle cx="89" cy="83" r="2" fill="#ffffff" />
      <circle cx="113" cy="83" r="2" fill="#ffffff" />

      {/* Брови */}
      {isCold ? (
        <>
          <path d="M82 74C86 76 92 78 94 77" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
          <path d="M118 74C114 76 108 78 106 77" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M82 76C86 73 92 74 94 76" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
          <path d="M118 76C114 73 108 74 106 76" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* Рот */}
      {isHappy ? (
        <path d="M92 112C96 118 104 118 108 112" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
      ) : isCold ? (
        <path d="M94 114C97 112 100 115 103 113C105 115 107 113 109 114" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M95 114H105" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Румянец */}
      <circle cx="78" cy="98" r="6" fill={isCold ? '#93c5fd' : '#fca5a5'} opacity="0.6" />
      <circle cx="122" cy="98" r="6" fill={isCold ? '#93c5fd' : '#fca5a5'} opacity="0.6" />

      {/* Волосы спереди / челка */}
      <path d="M68 70C80 40 120 40 132 70C118 60 82 60 68 70Z" fill="url(#hairGrad)" />
      <path d="M72 70C76 90 68 110 64 125" stroke="url(#hairGrad)" strokeWidth="6" strokeLinecap="round" />
      <path d="M128 70C124 90 132 110 136 125" stroke="url(#hairGrad)" strokeWidth="6" strokeLinecap="round" />

      {/* Руки (обнимает плечи от холода) */}
      {isCold ? (
        <g stroke="#fde68a" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M70 170L115 200" />
          <path d="M130 170L85 200" />
        </g>
      ) : (
        <g stroke="#fde68a" strokeWidth="11" strokeLinecap="round">
          <path d="M72 170L55 230" />
          <path d="M128 170L145 230" />
        </g>
      )}
    </svg>
  );
};

// Аватар Незнакомца / Принца под прикрытием
export const PrinceAvatar: React.FC<{ className?: string }> = ({ className = 'w-48 h-64' }) => (
  <svg viewBox="0 0 200 300" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cloakGrad" x1="40" y1="120" x2="160" y2="300" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e1b4b" />
        <stop offset="1" stopColor="#09090b" />
      </linearGradient>
      <linearGradient id="tunicGrad" x1="70" y1="140" x2="130" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#831843" />
        <stop offset="1" stopColor="#4c0519" />
      </linearGradient>
    </defs>

    {/* Капюшон / Плащ сзади */}
    <path d="M40 130L20 300H180L160 130Z" fill="url(#cloakGrad)" />

    {/* Тело / Туника */}
    <path d="M68 140L55 300H145L132 140H68Z" fill="url(#tunicGrad)" />
    {/* Золотая перевязь */}
    <path d="M66 148L135 250" stroke="#fbbf24" strokeWidth="6" />

    {/* Шея */}
    <rect x="88" y="115" width="24" height="28" fill="#e2e8f0" rx="3" />

    {/* Лицо */}
    <path d="M72 65C72 35 128 35 128 65C128 100 115 124 100 124C85 124 72 100 72 65Z" fill="#fcd34d" opacity="0.9" />

    {/* Темные решительные волосы */}
    <path d="M66 60C70 25 130 25 134 60C125 45 75 45 66 60Z" fill="#18181b" />
    <path d="M70 55L82 72L95 52L108 72L128 55" stroke="#18181b" strokeWidth="4" strokeLinecap="round" />

    {/* Глаза */}
    <ellipse cx="87" cy="74" rx="4.5" ry="5.5" fill="#1e293b" />
    <ellipse cx="113" cy="74" rx="4.5" ry="5.5" fill="#1e293b" />
    <circle cx="88" cy="73" r="1.5" fill="#ffffff" />
    <circle cx="114" cy="73" r="1.5" fill="#ffffff" />

    {/* Решительные брови */}
    <path d="M80 66L93 70" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M120 66L107 70" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" />

    {/* Волевой рот */}
    <path d="M94 102H106" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />

    {/* Фибула плаща */}
    <circle cx="78" cy="142" r="5" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
    <circle cx="122" cy="142" r="5" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
  </svg>
);
