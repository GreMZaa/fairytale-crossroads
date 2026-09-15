/**
 * @file storyData.ts
 * База знаний и серверное дерево новелл
 */

import { Story, StoryEpisode } from './types.js';

export const CINDERELLA_EPISODE_1: StoryEpisode = {
  id: 'cinderella-ep1',
  story_id: 'cinderella',
  episode_number: 1,
  title: 'Ледяная Башня',
  description: 'Метель за разбитым окном заброшенного чердака. До бала остались считанные часы.',
  initial_node_id: 'node_1',
  nodes: {
    node_1: {
      id: 'node_1',
      title: 'Холодный старт',
      background: 'attic_ice',
      bg_music: 'tower_theme',
      ambient: 'blizzard_wind',
      character: {
        id: 'cinderella',
        name: 'Золушка',
        emotion: 'shivering',
        avatar: '/assets/characters/cinderella_cold.webp',
        position: 'center'
      },
      dialogue: {
        speaker: 'Золушка',
        text: 'Мачеха заперла меня здесь перед самым балом... Ледяной ветер из разбитого окна пронизывает до костей! Если я ничего не предприму, я просто замерзну.'
      },
      puzzle: {
        problem_title: 'Разбитое окно и ледяной ветер',
        description: 'Снежная метель врывается в комнату! Выберите предмет для решения:',
        choices: [
          {
            id: 'choice_boards',
            text: 'Старые доски и гвозди',
            item_icon: 'boards',
            type: 'standard',
            cost: 0,
            result: 'success',
            feedback_text: 'Золушка находит старый молоток и наглухо заколачивает окно досками. Ветер стихает, но теперь дверь заперта снаружи!',
            next_node: 'node_2_timer',
            stat_changes: {
              courage: 1
            }
          },
          {
            id: 'choice_plunger',
            text: 'Вантуз со стены',
            item_icon: 'plunger',
            type: 'fail',
            cost: 0,
            result: 'fail',
            feedback_text: 'ЧПОК! Вантуз отскакивает от заледеневшей рамы и со свистом прилетает Золушке прямо в лоб! Ауч! О чем я только думала?!',
            sound_sfx: 'plunger_fail',
            next_node: 'node_1',
            stat_changes: {}
          },
          {
            id: 'choice_shawl',
            text: 'Магическая шаль Крестной',
            item_icon: 'magic_shawl',
            type: 'premium',
            cost: 20,
            allow_ad: true,
            result: 'premium_success',
            feedback_text: 'Шаль вспыхивает лазурным сиянием! Морозный ветер превращается в теплый вихрь хрустальных бабочек. Мышонок Гас приносит ключ от замка!',
            sound_sfx: 'magic_chime',
            bonus_text: 'Мышонок отпирает дубовую дверь — таймер ожидания пропущен!',
            next_node: 'node_3_fire',
            stat_changes: {
              courage: 2,
              light_path: 1
            }
          }
        ]
      }
    },
    node_2_timer: {
      id: 'node_2_timer',
      title: 'Взлом старой двери',
      background: 'attic_ice',
      bg_music: 'tower_theme',
      character: {
        id: 'cinderella',
        name: 'Золушка',
        emotion: 'determined',
        avatar: '/assets/characters/cinderella_determined.webp',
        position: 'center'
      },
      dialogue: {
        speaker: 'Золушка',
        text: 'Дверь заперта тяжелым ржавым засовом. Придется выбивать его ножкой от сломанного стула... Это займет время!'
      },
      timer_rescue: {
        title: 'Взлом дубовой двери',
        duration_seconds: 600,
        free_action_text: 'Ждать и выбивать засов (10 мин)',
        speedup_ad_text: 'Ускорить за рекламу ⏩ (00:00)',
        speedup_crystal_cost: 5,
        next_node: 'node_3_fire'
      }
    },
    node_3_fire: {
      id: 'node_3_fire',
      title: 'Встреча и Пожар',
      background: 'corridor_fire',
      bg_music: 'action_tension',
      ambient: 'burning_wood',
      character: {
        id: 'prince',
        name: 'Незнакомец в плаще',
        emotion: 'heroic',
        avatar: '/assets/characters/prince_cape.webp',
        position: 'right'
      },
      dialogue: {
        speaker: 'Незнакомец',
        text: 'Осторожно! Упал настенный факел! Старая винтовая лестница охвачена огнем, нам отрезан путь на нижний этаж!'
      },
      puzzle: {
        problem_title: 'Огонь на деревянной лестнице',
        description: 'Ступени рушатся в огне! Выберите предмет:',
        choices: [
          {
            id: 'choice_water',
            text: 'Ведро с водой',
            item_icon: 'bucket',
            type: 'standard',
            cost: 0,
            result: 'success',
            feedback_text: 'Золушка без колебаний опрокидывает ведро в огонь! Густой пар окутывает коридор. Пламя сбито, но платье в саже.',
            companion_reaction: 'Незнакомец улыбается: «Ты не боишься испачкаться. Мне нравятся смелые и решительные девушки!»',
            next_node: 'node_finish',
            stat_changes: {
              prince_affinity: 1,
              courage: 1
            }
          },
          {
            id: 'choice_fan',
            text: 'Шелковый веер',
            item_icon: 'fan',
            type: 'fail',
            cost: 0,
            result: 'fail',
            feedback_text: 'Взмах веера лишь раздувает искры! Пламя перекидывается на деревянные балки с удвоенной силой!',
            sound_sfx: 'fire_burst',
            next_node: 'node_3_fire',
            stat_changes: {}
          },
          {
            id: 'choice_ice_amulet',
            text: 'Ледяной амулет',
            item_icon: 'ice_amulet',
            type: 'premium',
            cost: 20,
            allow_ad: true,
            result: 'premium_success',
            feedback_text: 'Амулет озаряет замок арктической вспышкой! Огонь мгновенно кристаллизуется в прозрачный лед, образуя сверкающую хрустальную лестницу.',
            sound_sfx: 'ice_freeze',
            companion_reaction: 'Незнакомец ошеломлен: «Это... истинная древняя магия. Кто же ты на самом деле?..»',
            next_node: 'node_finish',
            stat_changes: {
              light_path: 2,
              prince_affinity: 2
            }
          }
        ]
      }
    },
    node_finish: {
      id: 'node_finish',
      title: 'Спуск и Побег',
      background: 'corridor_escape',
      bg_music: 'victory_romantic',
      character: {
        id: 'cinderella',
        name: 'Золушка',
        emotion: 'happy',
        avatar: '/assets/characters/cinderella_happy.webp',
        position: 'center'
      },
      dialogue: {
        speaker: 'Золушка',
        text: 'Мы выбрались в нижнюю королевскую галерею! Впереди сияет огнями бальный зал. Первый шаг к изменению моей судьбы сделан!'
      },
      summary: {
        title: 'Эпизод 1 пройден!',
        reward_crystals: 5,
        next_episode_id: 'cinderella-ep2'
      }
    }
  }
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'cinderella',
    title: 'Золушка: Хрустальные Цепи',
    description: 'Мачеха заперла Золушку в ледяной башне замка. Помоги ей выжить, преодолеть ловушки и изменить канон сказки!',
    cover_image: '/assets/stories/cinderella-cover.webp',
    tag: 'Драма & Спасение',
    is_active: true,
    episodes: [CINDERELLA_EPISODE_1]
  }
];
