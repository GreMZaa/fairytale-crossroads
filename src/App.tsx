/**
 * @file App.tsx
 * Главное приложение Telegram Mini App визуальной новеллы «Сказки: Перекрестки Судеб»
 * Полноценный интерфейс и меню в стиле Tile Family (Primer/1.jpg & 44.jpg)
 */

import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { LayerEngine } from './components/LayerEngine';
import { TopBar } from './components/TopBar';
import { DialogueBox } from './components/DialogueBox';
import { ChoiceButtons } from './components/ChoiceButtons';
import { TimerRescue } from './components/TimerRescue';
import { RescueActionBar } from './components/RescueActionBar';
import { BottomNav, NavTabId } from './components/BottomNav';
import { StoryAlbumModal } from './components/StoryAlbumModal';
import { SettingsModal } from './components/SettingsModal';
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
  const [activeActionAnimation, setActiveActionAnimation] = useState<'plunger' | 'boards' | 'magic_shawl' | 'ice_amulet' | 'water' | null>(null);

  // Состояние навигации и меню
  const [activeTab, setActiveTab] = useState<NavTabId>('home');
  const [isRescueToolsOpen, setIsRescueToolsOpen] = useState<boolean>(false);

  // Модальные окна
  const [isStoryAlbumOpen, setIsStoryAlbumOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isAdOpen, setIsAdOpen] = useState<boolean>(false);
  const [adContext, setAdContext] = useState<'free_crystals' | 'choice_shawl' | 'choice_ice' | 'timer'>('free_crystals');
  const [pendingChoice, setPendingChoice] = useState<PuzzleChoice | null>(null);

  const episode = CINDERELLA_EPISODE_1;
  const currentNode = episode.nodes[currentNodeId] || episode.nodes['node_1'];
  const currentStep = currentNodeId === 'node_1' ? 1 : currentNodeId === 'node_2_timer' ? 2 : 3;

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

    // Запуск сочной визуальной анимации действия (Вантуз, Доски, Магия)
    if (['plunger', 'boards', 'magic_shawl', 'ice_amulet'].includes(choice.item_icon)) {
      setActiveActionAnimation(choice.item_icon as any);
      setTimeout(() => {
        setActiveActionAnimation(null);
      }, 1300);
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
        setProfile(prev => ({
          ...prev,
          crystals: data.crystals,
          stats: data.updatedStats
        }));

        setFeedbackMessage(data.feedbackText);

        if (choice.result === 'fail') {
          soundEngine.playPlungerFail();
          hapticNotification('error');
          setIsFailState(true);
          setTimeout(() => setIsFailState(false), 900);
        } else if (choice.result === 'premium_success') {
          soundEngine.playMagicChime();
          if (choice.id === 'choice_ice_amulet') soundEngine.playIceFreeze();
          hapticNotification('success');
          setIsMagicState(true);
          setTimeout(() => {
            setIsMagicState(false);
            setCurrentNodeId(data.nextNodeId);
            setIsRescueToolsOpen(false);
          }, 1200);
        } else {
          soundEngine.playClick();
          hapticNotification('success');
          setTimeout(() => {
            setCurrentNodeId(data.nextNodeId);
            setIsRescueToolsOpen(false);
          }, 800);
        }
      } else {
        hapticNotification('error');
      }
    } catch {
      // Оффлайн fallback
      if (choice.result === 'fail') {
        soundEngine.playPlungerFail();
        setIsFailState(true);
        setTimeout(() => setIsFailState(false), 900);
      } else {
        setTimeout(() => {
          setCurrentNodeId(choice.next_node);
          setIsRescueToolsOpen(false);
        }, 800);
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

  // Обработка кликов по нижнему меню навигации
  const handleSelectTab = (tab: NavTabId) => {
    soundEngine.playClick();
    hapticImpact('light');
    setActiveTab(tab);

    if (tab === 'story') {
      setIsStoryAlbumOpen(true);
    } else if (tab === 'shop') {
      setAdContext('free_crystals');
      setIsAdOpen(true);
    } else if (tab === 'tasks' || tab === 'clan') {
      setIsStatsOpen(true);
    } else if (tab === 'home') {
      setIsStoryAlbumOpen(false);
      setIsStatsOpen(false);
      setIsAdOpen(false);
    }
  };

  // Переход по главам в Полароидном Альбоме
  const handleSelectChapter = (chapterId: string) => {
    soundEngine.playClick();
    hapticNotification('success');
    if (chapterId === 'cinderella-ep1') {
      setCurrentNodeId('node_1');
      setIsRescueToolsOpen(false);
    } else if (chapterId === 'cinderella-ep2') {
      setCurrentNodeId('node_3_fire');
      setIsRescueToolsOpen(false);
    }
    setIsStoryAlbumOpen(false);
    setActiveTab('home');
  };

  const isEpisodeFinished = currentNodeId === 'node_finish';

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Фоновый размытый арт для десктопных широкоформатных мониторов */}
      <div className="absolute inset-0 z-0 hidden md:block overflow-hidden pointer-events-none select-none">
        <img
          src={
            currentNode.background === 'corridor_fire'
              ? '/assets/backgrounds/corridor_fire.png'
              : '/assets/backgrounds/attic_ice.png'
          }
          alt=""
          className="w-full h-full object-cover filter blur-3xl opacity-30 scale-110"
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xl" />
      </div>

      {/* Основной контейнер мобильного Telegram Mini App */}
      <div className="relative w-full max-w-[430px] h-[100dvh] md:h-[860px] md:max-h-[92vh] md:rounded-[36px] md:shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08),0_0_50px_rgba(245,158,11,0.12)] overflow-hidden flex flex-col bg-slate-950 select-none z-10">
        
        {/* Верхняя статус-панель в точном стиле Tile Family (Primer/1.jpg) */}
        <TopBar
          crystals={profile.crystals}
          keys={profile.keys}
          stats={profile.stats}
          isMuted={isMuted}
          currentStep={currentStep}
          totalSteps={3}
          onToggleSound={handleToggleSound}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenShop={() => {
            setAdContext('free_crystals');
            setIsAdOpen(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 5-слойный игровой движок и экран новеллы */}
        <div className="relative flex-1 w-full overflow-hidden flex flex-col">
          <LayerEngine
            node={currentNode}
            isFailState={isFailState}
            isMagicState={isMagicState}
            activeActionAnimation={activeActionAnimation}
            onHotspotClick={() => {
              soundEngine.playClick();
              hapticImpact('light');
              setIsRescueToolsOpen(true);
            }}
          >
            {/* Всплывающее сообщение с результатом выбора */}
            {feedbackMessage && (
              <div className="mb-2 p-2.5 rounded-xl bg-slate-900/95 border border-amber-500/50 text-amber-200 text-xs text-center backdrop-blur-md animate-fade-in shadow-xl">
                {feedbackMessage}
              </div>
            )}

            {/* Диалоговое окно персонажа в стиле речевого бабла Tile Family */}
            {currentNode.dialogue && (
              <div className="mb-2">
                <DialogueBox
                  speaker={currentNode.dialogue.speaker}
                  text={currentNode.dialogue.text}
                  characterId={currentNode.character?.id}
                  showNextButton={!currentNode.puzzle && !currentNode.timer_rescue && !isEpisodeFinished}
                  onClickNext={() => {
                    if (currentNode.summary?.next_episode_id) {
                      // завершение
                    }
                  }}
                />
              </div>
            )}

            {/* Интерактивная часть действий спасения */}
            {currentNode.puzzle && (
              isRescueToolsOpen ? (
                /* Развернутый лоток инструментов (3 предмета) */
                <ChoiceButtons
                  choices={currentNode.puzzle.choices}
                  userCrystals={profile.crystals}
                  onSelectChoice={handleSelectChoice}
                  onWatchAdForChoice={handleWatchAdForChoice}
                  onClose={() => setIsRescueToolsOpen(false)}
                />
              ) : (
                /* Кнопка "Помощь" со стрелкой ⬇️ и кнопка "Уровень 1" как в Primer/1.jpg */
                <RescueActionBar
                  currentStep={currentStep}
                  totalSteps={3}
                  onOpenRescue={() => {
                    soundEngine.playClick();
                    hapticImpact('medium');
                    setIsRescueToolsOpen(true);
                  }}
                  onPlayLevel={() => {
                    soundEngine.playClick();
                    hapticImpact('medium');
                    setIsRescueToolsOpen(true);
                  }}
                />
              )
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
        </div>

        {/* Нижняя панель навигации (Dock Menu) из Primer/1.jpg */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          shopNotificationCount={1}
          storyNotification={true}
        />

        {/* Polaroid Меню Выбора Глав "История" (Primer/44.jpg) */}
        <StoryAlbumModal
          isOpen={isStoryAlbumOpen}
          onClose={() => {
            setIsStoryAlbumOpen(false);
            setActiveTab('home');
          }}
          currentEpisodeId={currentNodeId.includes('node_3') ? 'cinderella-ep2' : 'cinderella-ep1'}
          onSelectEpisode={handleSelectChapter}
        />

        {/* Модалка Настроек игры (Primer/8.jpg) */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          userName={profile.first_name}
          userId={profile.telegram_id}
        />

        {/* Модалка просмотра Rewarded Ads (+2 💎) */}
        <AdModal
          isOpen={isAdOpen}
          onClose={() => {
            setIsAdOpen(false);
            setPendingChoice(null);
            setActiveTab('home');
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
          onClose={() => {
            setIsStatsOpen(false);
            setActiveTab('home');
          }}
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
            setIsRescueToolsOpen(false);
            setActiveTab('home');
          }}
        />
      </div>
    </div>
  );
};
export default App;
