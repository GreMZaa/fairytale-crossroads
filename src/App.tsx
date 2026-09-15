/**
 * @file App.tsx
 * Главное приложение Telegram Mini App визуальной новеллы «Сказки: Перекрестки Судеб»
 */

import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { LayerEngine } from './components/LayerEngine';
import { TopBar } from './components/TopBar';
import { DialogueBox } from './components/DialogueBox';
import { ChoiceButtons } from './components/ChoiceButtons';
import { TimerRescue } from './components/TimerRescue';
import { AdModal } from './components/AdModal';
import { StatsModal } from './components/StatsModal';
import { EpisodeFinishedModal } from './components/EpisodeFinishedModal';
import { CINDERELLA_EPISODE_1 } from '../api/lib/storyData';
import { PuzzleChoice, UserProfile } from './types/game';
import { soundEngine } from './utils/audio';

export const App: React.FC = () => {
  const { user: tgUser, initData, hapticImpact, hapticNotification } = useTelegram();

  // Состояние профиля игрока
  const [profile, setProfile] = useState<UserProfile>({
    id: 'usr_local',
    telegram_id: tgUser?.id || 99887766,
    username: tgUser?.username || 'wanderer',
    first_name: tgUser?.first_name || 'Герой',
    crystals: 25,
    keys: 2,
    stats: {
      light_path: 0,
      dark_path: 0,
      courage: 0,
      cunning: 0,
      prince_affinity: 0
    }
  });

  // Текущая нода сюжета
  const [currentNodeId, setCurrentNodeId] = useState<string>('node_1');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Спецэффекты рендера
  const [isFailState, setIsFailState] = useState<boolean>(false);
  const [isMagicState, setIsMagicState] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Модальные окна
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isAdOpen, setIsAdOpen] = useState<boolean>(false);
  const [adContext, setAdContext] = useState<'free_crystals' | 'choice_shawl' | 'choice_ice' | 'timer'>('free_crystals');
  const [pendingChoice, setPendingChoice] = useState<PuzzleChoice | null>(null);

  const episode = CINDERELLA_EPISODE_1;
  const currentNode = episode.nodes[currentNodeId] || episode.nodes['node_1'];

  // Инициализация профиля с бэкенда
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initData,
            telegram_id: tgUser?.id || 99887766
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setProfile(data.user);
          }
        }
      } catch {
        // Оффлайн fallback
      }
    }
    fetchProfile();
  }, [initData, tgUser]);

  // Обработка выбора предмета в головоломке
  const handleSelectChoice = async (choice: PuzzleChoice) => {
    soundEngine.playClick();
    hapticImpact('medium');

    // Если выбор платный, но кристаллов не хватает
    if (choice.type === 'premium' && profile.crystals < choice.cost) {
      hapticNotification('warning');
      setPendingChoice(choice);
      setAdContext('choice_shawl');
      setIsAdOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          telegram_id: profile.telegram_id,
          story_id: 'cinderella',
          episode_id: 'cinderella-ep1',
          node_id: currentNodeId,
          choice_id: choice.id
        })
      });

      const data = await res.json();

      if (data.success) {
        // Обновляем кристаллы и статы
        setProfile(prev => ({
          ...prev,
          crystals: data.crystals,
          stats: data.updatedStats
        }));

        setFeedbackMessage(data.feedbackText);

        // Обработка реакций звука и анимаций
        if (choice.result === 'fail') {
          soundEngine.playPlungerFail();
          hapticNotification('error');
          setIsFailState(true);
          setTimeout(() => setIsFailState(false), 800);
        } else if (choice.result === 'premium_success') {
          soundEngine.playMagicChime();
          if (choice.id === 'choice_ice_amulet') soundEngine.playIceFreeze();
          hapticNotification('success');
          setIsMagicState(true);
          setTimeout(() => setIsMagicState(false), 1200);
          setCurrentNodeId(data.nextNodeId);
        } else {
          soundEngine.playClick();
          hapticNotification('success');
          setCurrentNodeId(data.nextNodeId);
        }
      } else {
        hapticNotification('error');
      }
    } catch {
      // Локальный fallback если сервер оффлайн
      if (choice.result === 'fail') {
        soundEngine.playPlungerFail();
        setIsFailState(true);
        setTimeout(() => setIsFailState(false), 800);
      } else {
        setCurrentNodeId(choice.next_node);
      }
    }
  };

  // Просмотр рекламы для бесплатного премиум-выбора
  const handleWatchAdForChoice = (choice: PuzzleChoice) => {
    setPendingChoice(choice);
    setAdContext('choice_shawl');
    setIsAdOpen(true);
  };

  // Завершение просмотра рекламы (начисление валюты или выполнение действия)
  const handleRewardClaimed = async (crystalsAwarded: number) => {
    try {
      const res = await fetch('/api/ads/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          telegram_id: profile.telegram_id
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({
          ...prev,
          crystals: data.new_balance
        }));
      } else {
        setProfile(prev => ({ ...prev, crystals: prev.crystals + crystalsAwarded }));
      }
    } catch {
      setProfile(prev => ({ ...prev, crystals: prev.crystals + crystalsAwarded }));
    }

    hapticNotification('success');

    // Если реклама смотрелась для разблокировки выбора
    if (pendingChoice) {
      const choiceToExecute = { ...pendingChoice, cost: 0 };
      setPendingChoice(null);
      handleSelectChoice(choiceToExecute);
    }
  };

  // Ускорение таймера побега за рекламу
  const handleSpeedupTimerAd = () => {
    setAdContext('timer');
    setIsAdOpen(true);
    // При завершении переходим к ноде огня
    setPendingChoice({
      id: 'speedup_ad',
      text: 'Ускорение за рекламу',
      item_icon: 'boards',
      type: 'standard',
      cost: 0,
      result: 'success',
      feedback_text: 'Вы выбиваете засов и вырываетесь в коридор замка!',
      next_node: 'node_3_fire',
      stat_changes: { courage: 1 }
    });
  };

  // Ускорение таймера побега за 5 кристаллов
  const handleSpeedupTimerCrystals = () => {
    if (profile.crystals < 5) return;
    setProfile(prev => ({ ...prev, crystals: prev.crystals - 5 }));
    soundEngine.playMagicChime();
    hapticNotification('success');
    setCurrentNodeId('node_3_fire');
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const isEpisodeFinished = currentNodeId === 'node_finish';

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden">
      {/* Верхняя статус-панель */}
      <TopBar
        crystals={profile.crystals}
        keys={profile.keys}
        stats={profile.stats}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenShop={() => {
          setAdContext('free_crystals');
          setIsAdOpen(true);
        }}
      />

      {/* 5-слойный игровой движок */}
      <LayerEngine
        node={currentNode}
        isFailState={isFailState}
        isMagicState={isMagicState}
      >
        {/* Всплывающее сообщение с результатом выбора */}
        {feedbackMessage && (
          <div className="mb-2 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-200 text-xs text-center backdrop-blur-md animate-fade-in shadow-lg">
            {feedbackMessage}
          </div>
        )}

        {/* Диалоговое окно персонажа */}
        {currentNode.dialogue && (
          <div className="mb-3">
            <DialogueBox
              speaker={currentNode.dialogue.speaker}
              text={currentNode.dialogue.text}
              showNextButton={!currentNode.puzzle && !currentNode.timer_rescue && !isEpisodeFinished}
              onClickNext={() => {
                if (currentNode.summary?.next_episode_id) {
                  // завершение
                }
              }}
            />
          </div>
        )}

        {/* Интерактивная головоломка со спасением героини (3 предмета) */}
        {currentNode.puzzle && (
          <ChoiceButtons
            choices={currentNode.puzzle.choices}
            userCrystals={profile.crystals}
            onSelectChoice={handleSelectChoice}
            onWatchAdForChoice={handleWatchAdForChoice}
          />
        )}

        {/* Механика ожидания (Таймер взлома двери) */}
        {currentNode.timer_rescue && (
          <TimerRescue
            timerData={currentNode.timer_rescue}
            userCrystals={profile.crystals}
            onSpeedupAd={handleSpeedupTimerAd}
            onSpeedupCrystals={handleSpeedupTimerCrystals}
            onTimerFinished={() => setCurrentNodeId('node_3_fire')}
          />
        )}
      </LayerEngine>

      {/* Модалка просмотра Rewarded Ads (+2 💎) */}
      <AdModal
        isOpen={isAdOpen}
        onClose={() => {
          setIsAdOpen(false);
          setPendingChoice(null);
        }}
        onRewardClaimed={handleRewardClaimed}
        title={
          adContext === 'choice_shawl'
            ? 'Посмотрите ролик, чтобы открыть Магическую шаль бесплатно!'
            : adContext === 'timer'
            ? 'Посмотрите ролик, чтобы мгновенно выбить засов двери!'
            : 'Посмотрите ролик для получения +2 Кристаллов 💎'
        }
      />

      {/* Модалка детальной статистики персонажа */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={profile.stats}
        crystals={profile.crystals}
        keys={profile.keys}
      />

      {/* Финальный экран завершения первого эпизода */}
      <EpisodeFinishedModal
        isOpen={isEpisodeFinished}
        stats={profile.stats}
        rewardCrystals={5}
        onRestart={() => {
          setCurrentNodeId('node_1');
          setFeedbackMessage(null);
        }}
      />
    </div>
  );
};
export default App;
