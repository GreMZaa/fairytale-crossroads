-- ====================================================================
-- Сказки: Перекрестки Судеб (Fairy Tale Crossroads)
-- Seed Data: Сказка "Золушка" и Эпизод 1: "Ледяная Башня"
-- ====================================================================

-- 1. Добавление истории
INSERT INTO public.stories (id, title, description, cover_image, tag, is_active)
VALUES (
    'cinderella',
    'Золушка: Хрустальные Цепи',
    'Знакомая сказка в новом свете. Злая мачеха заперла Золушку в замерзающей башне. Сможет ли она выжить и переломить свою судьбу?',
    '/assets/stories/cinderella-cover.webp',
    'Драма & Спасение',
    true
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    cover_image = EXCLUDED.cover_image,
    tag = EXCLUDED.tag;

-- 2. Добавление Эпизода 1 с сюжетным деревом
INSERT INTO public.episodes (id, story_id, episode_number, title, description, initial_node_id, nodes)
VALUES (
    'cinderella-ep1',
    'cinderella',
    1,
    'Ледяная Башня',
    'Метель воет за разбитым окном заброшенного чердака. Время на исходе, королевский бал вот-вот начнется.',
    'node_1',
    '{
      "node_1": {
        "id": "node_1",
        "title": "Холодный старт",
        "background": "attic_ice",
        "bg_music": "tower_theme",
        "ambient": "blizzard_wind",
        "character": {
          "id": "cinderella",
          "name": "Золушка",
          "emotion": "shivering",
          "avatar": "/assets/characters/cinderella_cold.webp",
          "position": "center"
        },
        "dialogue": {
          "speaker": "Золушка",
          "text": "Мачеха заперла меня... Ветер из разбитого окна пронизывает до костей! Я замерзну здесь насмерть, если срочно что-нибудь не придумаю."
        },
        "puzzle": {
          "problem_title": "Разбитое окно и ледяной ветер",
          "description": "Снег засыпает комнату. Температура стремительно падает!",
          "choices": [
            {
              "id": "choice_boards",
              "text": "Старые доски и гвозди",
              "item_icon": "boards",
              "type": "standard",
              "cost": 0,
              "result": "success",
              "feedback_text": "Золушка находит старый молоток и наглухо заколачивает раму. В комнате темнеет, но ветер отступает!",
              "next_node": "node_2_timer",
              "stat_changes": {}
            },
            {
              "id": "choice_plunger",
              "text": "Вантуз со стены",
              "item_icon": "plunger",
              "type": "fail",
              "cost": 0,
              "result": "fail",
              "feedback_text": "Чпок! Вантуз отскакивает от обледенелой рамы и со свистом бьет Золушку прямо по лбу! Ауч! О чем я только думала?!",
              "sound_sfx": "plunger_fail",
              "next_node": "node_1",
              "stat_changes": {}
            },
            {
              "id": "choice_shawl",
              "text": "Магическая шаль Крестной",
              "item_icon": "magic_shawl",
              "type": "premium",
              "cost": 20,
              "allow_ad": true,
              "result": "premium_success",
              "feedback_text": "Шаль вспыхивает сапфировым свечением! Лазурная магия мгновенно превращает метель в вихрь хрустальных бабочек, согревая чердак.",
              "sound_sfx": "magic_chime",
              "bonus_text": "Открыта тайна: Мышонок Гас пробирается сквозь щель и приносит старинный ключ от дубовой двери!",
              "next_node": "node_3_fire",
              "stat_changes": {
                "courage": 1,
                "light_path": 1
              }
            }
          ]
        }
      },
      "node_2_timer": {
        "id": "node_2_timer",
        "title": "Взлом старой двери",
        "background": "attic_ice",
        "bg_music": "tower_theme",
        "character": {
          "id": "cinderella",
          "name": "Золушка",
          "emotion": "determined",
          "avatar": "/assets/characters/cinderella_determined.webp",
          "position": "center"
        },
        "dialogue": {
          "speaker": "Золушка",
          "text": "Дверь заперта на ржавый засов. Мне нужно выбить его тяжелой ножкой от стула, но на это уйдет немало сил и времени..."
        },
        "timer_rescue": {
          "title": "Взлом дубовой двери",
          "duration_seconds": 600,
          "free_action_text": "Ждать и методично долбить засов",
          "speedup_ad_text": "Ускорить за рекламу ⏩ (00:00)",
          "speedup_crystal_cost": 5,
          "next_node": "node_3_fire"
        }
      },
      "node_3_fire": {
        "id": "node_3_fire",
        "title": "Встреча и Пожар",
        "background": "corridor_fire",
        "bg_music": "action_tension",
        "ambient": "burning_wood",
        "character": {
          "id": "prince",
          "name": "Незнакомец",
          "emotion": "heroic",
          "avatar": "/assets/characters/prince_cape.webp",
          "position": "right"
        },
        "dialogue": {
          "speaker": "Незнакомец",
          "text": "Осторожно! Факел упал со стены! Старая лестница вспыхнула как спичка — нам отрезан путь вниз!"
        },
        "puzzle": {
          "problem_title": "Огонь на деревянной лестнице",
          "description": "Пламя пожирает ступени. Нужно действовать немедленно!",
          "choices": [
            {
              "id": "choice_water",
              "text": "Ведро с дождевой водой",
              "item_icon": "bucket",
              "type": "standard",
              "cost": 0,
              "result": "success",
              "feedback_text": "Золушка опрокидывает ведро прямо в пламя. С шипением поднимается густой пар. Огонь сбит, но подол платья испачкан сажей.",
              "companion_reaction": "Незнакомец улыбается: «Ты не боишься испачкаться. Мне нравятся смелые и решительные девушки!»",
              "next_node": "node_finish",
              "stat_changes": {
                "prince_affinity": 1,
                "courage": 1
              }
            },
            {
              "id": "choice_fan",
              "text": "Шелковый веер",
              "item_icon": "fan",
              "type": "fail",
              "cost": 0,
              "result": "fail",
              "feedback_text": "О нет! Взмах веера только подпитывает пламя кислородом, огонь яростно вздымается вверх, опаляя перила!",
              "sound_sfx": "fire_burst",
              "next_node": "node_3_fire",
              "stat_changes": {}
            },
            {
              "id": "choice_ice_amulet",
              "text": "Ледяной амулет",
              "item_icon": "ice_amulet",
              "type": "premium",
              "cost": 20,
              "allow_ad": true,
              "result": "premium_success",
              "feedback_text": "Амулет озаряет коридор арктической вспышкой! Огонь мгновенно застывает в форме сверкающих ледяных кристаллов, создавая хрустальную лестницу.",
              "sound_sfx": "ice_freeze",
              "companion_reaction": "Незнакомец замирает в изумлении: «Это... истинная древняя магия. Кто же ты на самом деле?..»",
              "next_node": "node_finish",
              "stat_changes": {
                "light_path": 2,
                "prince_affinity": 2
              }
            }
          ]
        }
      },
      "node_finish": {
        "id": "node_finish",
        "title": "Спуск и Побег",
        "background": "corridor_escape",
        "bg_music": "victory_romantic",
        "character": {
          "id": "cinderella",
          "name": "Золушка",
          "emotion": "triumphant",
          "avatar": "/assets/characters/cinderella_happy.webp",
          "position": "center"
        },
        "dialogue": {
          "speaker": "Золушка",
          "text": "Мы выбрались в нижнюю галерею! Вдали гремит музыка королевского оркестра... Первый шаг к свободе сделан."
        },
        "summary": {
          "title": "Эпизод 1 завершен!",
          "reward_crystals": 5,
          "next_episode_id": "cinderella-ep2"
        }
      }
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    initial_node_id = EXCLUDED.initial_node_id,
    nodes = EXCLUDED.nodes;
