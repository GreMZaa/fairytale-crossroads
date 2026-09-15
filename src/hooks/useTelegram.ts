/**
 * @file useTelegram.ts
 * @security Хук взаимодействия с Telegram Mini App SDK
 * Реализует требования Apple HIG, expand(), блокировку свайпов и Haptic Feedback
 */

import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date?: number;
          hash?: string;
        };
        colorScheme?: 'light' | 'dark';
        themeParams?: Record<string, string>;
        isExpanded?: boolean;
        viewportHeight?: number;
        viewportStableHeight?: number;
        expand: () => void;
        close: () => void;
        ready: () => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const webApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

  useEffect(() => {
    if (webApp) {
      // 1. Расширение на весь экран
      webApp.ready();
      webApp.expand();

      // 2. Блокировка системного свайпа вниз (overscroll)
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';

      const preventTouchMove = (e: TouchEvent) => {
        // Запрещаем скролл на корневом элементе для предотвращения закрытия TMA
        if (window.scrollY === 0 && e.touches[0].clientY > 10) {
          // разрешаем скролл внутри элементов с классом scrollable
          const target = e.target as HTMLElement | null;
          if (!target?.closest('.allow-scroll')) {
            // e.preventDefault();
          }
        }
      };

      window.addEventListener('touchmove', preventTouchMove, { passive: false });
      setIsReady(true);

      return () => {
        window.removeEventListener('touchmove', preventTouchMove);
      };
    } else {
      setIsReady(true);
    }
  }, [webApp]);

  // Тактильный отклик (Haptic Feedback)
  const hapticImpact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      webApp?.HapticFeedback?.impactOccurred(style);
    } catch {
      // no-op в браузере вне Telegram
    }
  }, [webApp]);

  const hapticNotification = useCallback((type: 'success' | 'error' | 'warning') => {
    try {
      webApp?.HapticFeedback?.notificationOccurred(type);
    } catch {
      // no-op
    }
  }, [webApp]);

  const hapticSelection = useCallback(() => {
    try {
      webApp?.HapticFeedback?.selectionChanged();
    } catch {
      // no-op
    }
  }, [webApp]);

  // Данные пользователя Telegram
  const telegramUser = webApp?.initDataUnsafe?.user || {
    id: 99887766,
    first_name: 'Игрок',
    username: 'fairytale_wanderer'
  };

  const initData = webApp?.initData || '';

  return {
    webApp,
    isReady,
    user: telegramUser,
    initData,
    hapticImpact,
    hapticNotification,
    hapticSelection
  };
}
