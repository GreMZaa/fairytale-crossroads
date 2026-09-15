/**
 * @file useTypewriter.ts
 * Эффект посимвольного появления текста («Печатная машинка») с пропуском по тапу
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTypewriterOptions {
  speed?: number; // задержка в мс на символ (по умолчанию 30-40 мс)
  onCharacter?: () => void; // коллбек для звука клика
  onComplete?: () => void;
}

export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
  const { speed = 35, onCharacter, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const textRef = useRef(text);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Сброс при смене текста
  useEffect(() => {
    textRef.current = text;
    setDisplayedText('');
    setIsCompleted(false);
    indexRef.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    if (!text) {
      setIsCompleted(true);
      return;
    }

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      const nextSlice = textRef.current.slice(0, indexRef.current);
      setDisplayedText(nextSlice);

      if (onCharacter && indexRef.current % 2 === 0) {
        onCharacter();
      }

      if (indexRef.current >= textRef.current.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, onCharacter, onComplete]);

  // Мгновенный пропуск (Skip)
  const skip = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(textRef.current);
    setIsCompleted(true);
    if (onComplete) onComplete();
  }, [onComplete]);

  return {
    displayedText,
    isCompleted,
    skip
  };
}
