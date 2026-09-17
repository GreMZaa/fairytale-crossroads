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
  const { speed = 25, onCharacter, onComplete } = options;
  const [displayedText, setDisplayedText] = useState(text || '');
  const [isCompleted, setIsCompleted] = useState(true);

  const textRef = useRef(text);
  const onCharRef = useRef(onCharacter);
  const onCompRef = useRef(onComplete);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onCharRef.current = onCharacter;
    onCompRef.current = onComplete;
  });

  // Запуск печатания только при реальной смене текста
  useEffect(() => {
    textRef.current = text;
    if (!text) {
      setDisplayedText('');
      setIsCompleted(true);
      return;
    }

    setDisplayedText('');
    setIsCompleted(false);
    indexRef.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      const nextSlice = textRef.current.slice(0, indexRef.current);
      setDisplayedText(nextSlice);

      if (onCharRef.current && indexRef.current % 3 === 0) {
        onCharRef.current();
      }

      if (indexRef.current >= textRef.current.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsCompleted(true);
        if (onCompRef.current) onCompRef.current();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

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
