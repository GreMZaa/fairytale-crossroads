/**
 * @file App.tsx
 * Главное приложение Telegram Mini App в полном визуальном и игровом стиле Tile Family (Primer/1.jpg - 44.jpg)
 * Реальное прохождение: сюжет, диалоги, выбор имени, интерактивные точки ремонта,
 * динамическая трансформация комнаты и играбельная мини-игра «Собери 3 фишки»!
 */

import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { TopBar } from './components/TopBar';
import { LayerEngine } from './components/LayerEngine';
import { DialogueBox } from './components/DialogueBox';
import { RenovationHotspots } from './components/RenovationHotspots';
import { RescueActionBar } from './components/RescueActionBar';
import { BottomNav, NavTabId } from './components/BottomNav';
import { TilePuzzleModal } from './components/TilePuzzleModal';
import { NameInputModal } from './components/NameInputModal';
import { VictoryModal } from './components/VictoryModal';
import { StoryAlbumModal } from './components/StoryAlbumModal';
import { SettingsModal } from './components/SettingsModal';
import { AdModal } from './components/AdModal';
import { StatsModal } from './components/StatsModal';
import { RENOVATION_STAGES } from './data/storyData';
import { UserProfile } from './types/game';
import { soundEngine } from './utils/audio';

export const App: React.FC = () => {
  const { user: tgUser, initData: _initData, hapticImpact, hapticNotification } = useTelegram();

  // Профиль игрока
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tile_family_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      id: 'usr_local',
      telegram_id: tgUser?.id || 99887766,
      username: tgUser?.username || 'wanderer',
      first_name: tgUser?.first_name || 'Шороо',
      stars: 2, // Начальные 2 звезды как в Primer/1.jpg
      coins: 2000,
      lives: 5,
      crystals: 25,
      keys: 2,
      renovationStep: 0,
      stats: {
        light_path: 1,
        dark_path: 0,
        courage: 2,
        cunning: 0,
        prince_affinity: 1
      }
    };
  });

  // Индекс текущей реплики диалога на текущем этапе
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);

  // Модальные окна
  const [isNameInputOpen, setIsNameInputOpen] = useState<boolean>(false);
  const [isPuzzleOpen, setIsPuzzleOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isStoryAlbumOpen, setIsStoryAlbumOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isAdOpen, setIsAdOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTabId>('home');

  // Сохранение профиля
  useEffect(() => {
    localStorage.setItem('tile_family_profile', JSON.stringify(profile));
  }, [profile]);

  // Текущий этап ремонта
  const currentStage = RENOVATION_STAGES[profile.renovationStep] || RENOVATION_STAGES[0];
  const currentDialogue = currentStage.dialogues[dialogueIndex];

  // Проверка завершения всех этапов (12/12)
  useEffect(() => {
    if (profile.renovationStep >= RENOVATION_STAGES.length - 1) {
      setIsVictoryOpen(true);
    }
  }, [profile.renovationStep]);

  // Следующая реплика в диалоге
  const handleNextDialogue = () => {
    soundEngine.playClick();
    hapticImpact('light');

    // На шаге 0 после 5-й реплики открываем модалку ввода имени (Primer/8.jpg)
    if (profile.renovationStep === 0 && dialogueIndex === 5 && !localStorage.getItem('tile_name_entered')) {
      setIsNameInputOpen(true);
      return;
    }

    if (dialogueIndex < currentStage.dialogues.length - 1) {
      setDialogueIndex(prev => prev + 1);
    }
  };

  // Подтверждение имени игрока
  const handleSubmitName = (enteredName: string) => {
    localStorage.setItem('tile_name_entered', 'true');
    setProfile(prev => ({ ...prev, first_name: enteredName }));
    setIsNameInputOpen(false);
    hapticNotification('success');
    setDialogueIndex(6); // Переход к реплике Аманды с просьбой о помощи
  };

  // Активация ремонта предмета (клик по хотспоту или кнопке «Помощь»)
  const handlePerformRenovation = () => {
    const hotspot = currentStage.hotspot;
    if (!hotspot) return;

    soundEngine.playClick();

    // Хватает ли звезд?
    if (profile.stars < hotspot.costStars) {
      hapticNotification('warning');
      // Предлагаем сыграть в уровень или посмотреть рекламу
      setIsPuzzleOpen(true);
      return;
    }

    // Ремонт успешен!
    hapticNotification('success');
    soundEngine.playMagicChime();

    setProfile(prev => ({
      ...prev,
      stars: prev.stars - hotspot.costStars,
      renovationStep: Math.min(RENOVATION_STAGES.length - 1, prev.renovationStep + 1)
    }));

    setDialogueIndex(0); // Сброс диалога для нового этапа
  };

  // Победа в мини-игре «Собери 3 фишки» (+2 ⭐)
  const handlePuzzleWin = (starsWon: number) => {
    hapticNotification('success');
    setProfile(prev => ({
      ...prev,
      stars: prev.stars + starsWon,
      coins: prev.coins + 100
    }));
  };

  // Награда за рекламу (+2 💎 / +2 ⭐)
  const handleRewardClaimed = (crystalsAwarded: number) => {
    hapticNotification('success');
    setProfile(prev => ({
      ...prev,
      stars: prev.stars + 2,
      crystals: prev.crystals + crystalsAwarded
    }));
    setIsAdOpen(false);
  };

  // Навигация
  const handleSelectTab = (tab: NavTabId) => {
    soundEngine.playClick();
    hapticImpact('light');
    setActiveTab(tab);

    if (tab === 'story') {
      setIsStoryAlbumOpen(true);
    } else if (tab === 'shop') {
      setIsAdOpen(true);
    } else if (tab === 'tasks' || tab === 'clan') {
      setIsStatsOpen(true);
    } else if (tab === 'home') {
      setIsStoryAlbumOpen(false);
      setIsStatsOpen(false);
      setIsAdOpen(false);
    }
  };

  // Перезапуск истории
  const handleRestartStory = () => {
    soundEngine.playClick();
    setProfile(prev => ({
      ...prev,
      stars: 2,
      renovationStep: 0
    }));
    setDialogueIndex(0);
    setIsVictoryOpen(false);
    localStorage.removeItem('tile_name_entered');
  };

  // Динамический текст диалога с подстановкой имени игрока
  const formattedDialogueText = currentDialogue
    ? currentDialogue.text.replace(/\[Имя\]/g, profile.first_name)
    : '';

  return (
    <div className="relative w-full min-h-screen bg-[#1E293B] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Фоновый мягкий блюр для широких экранов */}
      <div className="absolute inset-0 z-0 hidden md:block overflow-hidden pointer-events-none select-none">
        <img
          src={currentStage.background}
          alt=""
          className="w-full h-full object-cover filter blur-3xl opacity-40 scale-115"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      {/* Основной мобильный контейнер игры (Форм-фактор смартфона как в Tile Family) */}
      <div className="relative w-full max-w-[430px] h-[100dvh] md:h-[860px] md:max-h-[92vh] md:rounded-[36px] md:border-[3px] md:border-amber-400/40 md:shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col bg-slate-900 select-none z-10">
        
        {/* 1. Верхняя панель статуса (Coins 2000, Lives 5, Stars 2, Шкала 0/12 с 🎁) */}
        <TopBar
          coins={profile.coins}
          lives={profile.lives}
          stars={profile.stars}
          crystals={profile.crystals}
          currentStep={profile.renovationStep}
          totalSteps={12}
          onOpenShop={() => setIsAdOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 2. Игровое поле: Динамическая комната и интерактивные хотспоты ремонта */}
        <div className="relative flex-1 w-full overflow-hidden">
          <LayerEngine currentBackground={currentStage.background}>
            
            {/* Круглый интерактивный хотспот над ремонтируемым объектом (Primer/12.jpg) */}
            {currentStage.hotspot && (
              <RenovationHotspots
                hotspot={currentStage.hotspot}
                userStars={profile.stars}
                onActivate={handlePerformRenovation}
              />
            )}

            {/* Верхнее пустое пространство для фокуса на комнате */}
            <div className="w-full h-10" />

            {/* Нижняя часть сцены: Диалоговый бабл и кнопки действий */}
            <div className="w-full flex flex-col gap-2 pb-1">
              
              {/* Речевой бабл персонажей в стиле Tile Family (Primer/1.jpg - 7.jpg) */}
              {currentDialogue && (
                <DialogueBox
                  speaker={currentDialogue.speaker}
                  text={formattedDialogueText}
                  avatar={currentDialogue.avatar}
                  ribbonColor={currentDialogue.ribbonColor}
                  showNextButton={dialogueIndex < currentStage.dialogues.length - 1}
                  onClickNext={handleNextDialogue}
                />
              )}

              {/* Панель действий: Золотая кнопка "Помощь" со стрелкой ⬇️ и сочная зеленая "Уровень [N]" */}
              <RescueActionBar
                currentStep={profile.renovationStep}
                totalSteps={12}
                onOpenRescue={handlePerformRenovation}
                onPlayLevel={() => {
                  soundEngine.playClick();
                  hapticImpact('medium');
                  setIsPuzzleOpen(true);
                }}
              />
            </div>
          </LayerEngine>
        </div>

        {/* 3. Нижнее меню навигации (Primer/1.jpg) */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          shopNotificationCount={1}
          storyNotification={true}
        />

        {/* Модалка ввода имени игрока (Primer/8.jpg) */}
        <NameInputModal
          isOpen={isNameInputOpen}
          initialName={profile.first_name}
          onClose={() => setIsNameInputOpen(false)}
          onSubmitName={handleSubmitName}
        />

        {/* Играбельная мини-игра головоломка "Собери 3 фишки" (Tile Family Match-3 Core Gameplay) */}
        <TilePuzzleModal
          isOpen={isPuzzleOpen}
          levelNumber={profile.renovationStep + 1}
          onClose={() => setIsPuzzleOpen(false)}
          onWin={handlePuzzleWin}
        />

        {/* Экран победы и открытия сундука с сокровищами (Primer/40.jpg & 41.jpg) */}
        <VictoryModal
          isOpen={isVictoryOpen}
          onRestart={handleRestartStory}
        />

        {/* Полароидный альбом глав (Primer/44.jpg) */}
        <StoryAlbumModal
          isOpen={isStoryAlbumOpen}
          onClose={() => {
            setIsStoryAlbumOpen(false);
            setActiveTab('home');
          }}
          currentEpisodeId="cinderella-ep1"
          onSelectEpisode={() => {
            setIsStoryAlbumOpen(false);
            setActiveTab('home');
          }}
        />

        {/* Модалка настроек */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isMuted={isMuted}
          onToggleSound={() => {
            const muted = soundEngine.toggleMute();
            setIsMuted(muted);
          }}
          userName={profile.first_name}
          userId={profile.telegram_id}
        />

        {/* Модалка просмотра рекламы за звезды/кристаллы */}
        <AdModal
          isOpen={isAdOpen}
          onClose={() => {
            setIsAdOpen(false);
            setActiveTab('home');
          }}
          onRewardClaimed={handleRewardClaimed}
          title="Посмотрите ролик для получения +2 ⭐ Звезд и Кристаллов!"
        />

        {/* Модалка статистики игрока */}
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
      </div>
    </div>
  );
};
export default App;
