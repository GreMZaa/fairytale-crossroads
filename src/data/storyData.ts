/**
 * @file storyData.ts
 * Полная сюжетная линия и этапы обустройства комнаты в точном соответствии со скринами Tile Family (Primer/)
 */

import { RenovationStage } from '../types/game';

export const RENOVATION_STAGES: RenovationStage[] = [
  // Этап 0: Заледенелая комната, замерзающая семья, прорыв трубы (Primer/1.jpg - 12.jpg)
  {
    step: 0,
    background: '/assets/primer/12.jpg',
    title: 'Ледяной чердак: Прорыв трубы',
    dialogues: [
      {
        speaker: 'Изабелла',
        text: 'Наконец здесь! Нет времени объяснять — заходите, вы нужны нам.',
        avatar: '/assets/primer/1.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Лестер',
        text: 'Ох, здесь жутко холодно. Подпиши договор, и ты наконец оставишь это ветхое место позади.',
        avatar: '/assets/primer/2.jpg',
        ribbonColor: 'red'
      },
      {
        speaker: 'Миа',
        text: '(Мама, нет...)',
        avatar: '/assets/primer/3.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Изабелла',
        text: 'Хватит, Лестер! Не уедем, наш дом тут.',
        avatar: '/assets/primer/4.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Лестер',
        text: 'Будь трезв: без меня зиму не переживёте.',
        avatar: '/assets/primer/5.jpg',
        ribbonColor: 'red'
      },
      {
        speaker: 'Изабелла',
        text: 'Не притворяйся. Есть тот, кто искренне нам поможет!',
        avatar: '/assets/primer/6.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Аманда',
        text: 'Трубу разорвало от мороза! Ледяная вода заливает пол, мы замерзнем. Поможешь нам?',
        avatar: '/assets/primer/10.jpg',
        ribbonColor: 'blue'
      }
    ],
    hotspot: {
      id: 'pipe_repair',
      title: 'Поставить обогреватель',
      costStars: 2,
      iconType: 'hammer',
      x: 18,
      y: 40
    }
  },

  // Этап 1: Труба заменена на обогреватель с чайником (Primer/13.jpg - 17.jpg)
  {
    step: 1,
    background: '/assets/primer/13.jpg',
    title: 'Тепло от печки (1/12)',
    dialogues: [
      {
        speaker: 'Миа',
        text: 'Мамочка, мне очень холодно...',
        avatar: '/assets/primer/14.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Аманда',
        text: 'Не бойся, милая. Мы справимся с этим.',
        avatar: '/assets/primer/15.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Изабелла',
        text: 'От печки пошло первое тепло, но метель из разбитого окна все выдувает! Нужно починить окно!',
        avatar: '/assets/primer/16.jpg',
        ribbonColor: 'blue'
      }
    ],
    hotspot: {
      id: 'window_repair',
      title: 'Застеклить окно',
      costStars: 2,
      iconType: 'window',
      x: 39,
      y: 31
    }
  },

  // Этап 2: Окно отремонтировано, шторы, часы (Primer/18.jpg - 19.jpg)
  {
    step: 2,
    background: '/assets/primer/18.jpg',
    title: 'Уютное окно (2/12)',
    dialogues: [
      {
        speaker: 'Аманда',
        text: 'Смотри, метель больше не задувает! В комнате наконец-то стало тихо.',
        avatar: '/assets/primer/10.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Изабелла',
        text: 'Вентилятор под потолком опасно искрит и вот-вот упадет. Нужно починить его и включить свет!',
        avatar: '/assets/primer/6.jpg',
        ribbonColor: 'blue'
      }
    ],
    hotspot: {
      id: 'fan_repair',
      title: 'Починить люстру',
      costStars: 1,
      iconType: 'wrench',
      x: 80,
      y: 19
    }
  },

  // Этап 3: Люстра починена и светит золотым светом (Primer/20.jpg)
  {
    step: 3,
    background: '/assets/primer/20.jpg',
    title: 'Теплый свет (3/12)',
    dialogues: [
      {
        speaker: 'Изабелла',
        text: 'Какой мягкий золотой свет! В комнате стало светлее и радостнее.',
        avatar: '/assets/primer/1.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Аманда',
        text: 'На полу ледяная жижа и мусор, а детям негде играть. Нам нужен теплый ковер и шкаф для книг.',
        avatar: '/assets/primer/10.jpg',
        ribbonColor: 'blue'
      }
    ],
    hotspot: {
      id: 'furniture_repair',
      title: 'Постелить ковер и шкаф',
      costStars: 2,
      iconType: 'rug',
      x: 68,
      y: 78
    }
  },

  // Этап 4: Книжный шкаф, желтый пушистый ковер, столик для рисования (Primer/25.jpg)
  {
    step: 4,
    background: '/assets/primer/25.jpg',
    title: 'Детский уголок (7/12)',
    dialogues: [
      {
        speaker: 'Миа',
        text: 'Ура! У меня появился свой столик с цветными мелками и плюшевый мишка!',
        avatar: '/assets/primer/3.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Аманда',
        text: 'Ты творишь настоящие чудеса! Но постель все еще холодная, а дети в рваных платьях.',
        avatar: '/assets/primer/10.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Изабелла',
        text: 'Обустроим удобную теплую кровать с мягким одеялом и оденем семью в новые наряды!',
        avatar: '/assets/primer/6.jpg',
        ribbonColor: 'blue'
      }
    ],
    hotspot: {
      id: 'bed_repair',
      title: 'Утеплить постель',
      costStars: 2,
      iconType: 'bed',
      x: 48,
      y: 53
    }
  },

  // Этап 5: Чистая одежда, новая постель, счастливые дети (Primer/30.jpg)
  {
    step: 5,
    background: '/assets/primer/30.jpg',
    title: 'Счастливая семья (10/12)',
    dialogues: [
      {
        speaker: 'Изабелла',
        text: 'Конечно. Лестер – жестокий бизнесмен, скупает город дёшево, не думая о людях.',
        avatar: '/assets/primer/30.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Аманда',
        text: 'Но теперь нам не страшен никакой Лестер! Наш дом полон тепла, а дети сыты и улыбаются.',
        avatar: '/assets/primer/30.jpg',
        ribbonColor: 'blue'
      },
      {
        speaker: 'Изабелла',
        text: 'Остался финальный штрих — включить торшер и украсить комнату к празднику!',
        avatar: '/assets/primer/30.jpg',
        ribbonColor: 'blue'
      }
    ],
    hotspot: {
      id: 'lamp_decor',
      title: 'Зажечь торшер',
      costStars: 1,
      iconType: 'lamp',
      x: 90,
      y: 45
    }
  },

  // Этап 6: Финал - 100% обустроенная комната, шарики, победа! (Primer/40.jpg & 41.jpg)
  {
    step: 6,
    background: '/assets/primer/40.jpg',
    title: 'Комната спасена! (12/12)',
    isCompleted: true,
    dialogues: [
      {
        speaker: 'Миа',
        text: 'Спасибо тебе, наш самый лучший защитник! Это самый уютный дом на свете!',
        avatar: '/assets/primer/40.jpg',
        ribbonColor: 'gold'
      }
    ]
  }
];
