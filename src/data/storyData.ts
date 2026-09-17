/**
 * @file storyData.ts
 * Сюжетное дерево новеллы «Сказки: Перекрестки Судеб»
 */

import { StoryEpisode } from '../types/game';

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
        avatar: '/assets/characters/cinderella_cold.png',
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
        avatar: '/assets/characters/cinderella_cold.png',
        position: 'center'
      },
      dialogue: {
        speaker: 'Золушка',
        text: 'Дверь заперта тяжелым ржавым засовом. Придется выбивать его ножкой от сломанного стула... Это займет время!'
      },
      timer_rescue: {
        title: 'Взлом дубовой двери',
        duration_seconds: 600,
        free_action_text: 'Ждать пока засов поддастся',
        speedup_ad_text: 'Ускорить за рекламу',
        speedup_crystal_cost: 5,
        next_node: 'node_3_fire'
      }
    },
    node_3_fire: {
      id: 'node_3_fire',
      title: 'Пламя в коридоре',
      background: 'corridor_fire',
      bg_music: 'fire_escape_theme',
      character: {
        id: 'cinderella',
        name: 'Золушка',
        emotion: 'shivering',
        avatar: '/assets/characters/cinderella_cold.png',
        position: 'center'
      },
      dialogue: {
        speaker: 'Золушка',
        text: 'О нет! На лестнице упал старый канделябр — ковер и ступени объяты пламенем! Мне не пройти к выходу из башни!'
      },
      puzzle: {
        problem_title: 'Огонь на винтовой лестнице',
        description: 'Огонь преграждает путь! Как преодолеть пламя?',
        choices: [
          {
            id: 'choice_bucket',
            text: 'Ведро с талой водой',
            item_icon: 'bucket',
            type: 'standard',
            cost: 0,
            result: 'success',
            feedback_text: 'Ш-ш-ш! Вода сбивает часть пламени, и Золушка проскакивает через дым во внутренний двор замка!',
            next_node: 'node_finish',
            stat_changes: {
              courage: 1
            }
          },
          {
            id: 'choice_fan',
            text: 'Перьевой веер',
            item_icon: 'fan',
            type: 'fail',
            cost: 0,
            result: 'fail',
            feedback_text: 'Взмах веера только раздувает пламя! Искры опалили подол платья! Пришлось отскочить назад.',
            sound_sfx: 'fire_whoosh',
            next_node: 'node_3_fire',
            stat_changes: {}
          },
          {
            id: 'choice_ice_amulet',
            text: 'Ледяной амулет Северного ветра',
            item_icon: 'ice_amulet',
            type: 'premium',
            cost: 25,
            allow_ad: false,
            result: 'premium_success',
            feedback_text: 'Амулет излучает арктический холод! Пламя мгновенно замерзает хрустальной ледяной скульптурой. На ступенях появляется Принц!',
            sound_sfx: 'ice_freeze',
            bonus_text: 'Принц поражен вашей отвагой и предлагает руку!',
            next_node: 'node_finish',
            stat_changes: {
              courage: 3,
              prince_affinity: 1
            }
          }
        ]
      }
    },
    node_finish: {
      id: 'node_finish',
      title: 'Свобода и путь на бал',
      background: 'corridor_fire',
      bg_music: 'triumph_theme',
      character: {
        id: 'prince',
        name: 'Принц Анри',
        emotion: 'triumphant',
        avatar: '/assets/characters/prince_cape.png',
        position: 'center'
      },
      dialogue: {
        speaker: 'Принц Анри',
        text: 'Вы спаслись из ледяной башни! Карета подана, и бал вот-вот начнется. Ваша судьба только начинается...'
      },
      summary: {
        title: 'Глава 1: «Ледяная Башня» успешно завершена!',
        reward_crystals: 5,
        next_episode_id: 'cinderella-ep2'
      }
    }
  }
};
