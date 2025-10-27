// VALORANT Agents Database - Part 1: Data Types and Agents
export interface AgentPlaystyle {
  name: string;
  role: 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  playstyle: {
    aggression: number; // 1-10
    teamplay: number; // 1-10
    utility: number; // 1-10
    versatility: number; // 1-10
  };
  bestFor: string[];
  description: string;
  tips: string[];
}

export const AGENTS_DATABASE: AgentPlaystyle[] = [
  // DUELISTS
  {
    name: 'Jett',
    role: 'Duelist',
    difficulty: 'Hard',
    playstyle: { aggression: 10, teamplay: 4, utility: 3, versatility: 7 },
    bestFor: ['Агресивна гра', 'Швидкі піки', 'Операторська гра', 'Соло гра', 'Мобільність'],
    description: 'Найагресивніший дуеліст з найкращою мобільністю. Ідеальна для швидких входів та операторської гри.',
    tips: ['Використовуй Dash після вбивства', 'Ідеальна для операторської гри', 'Cloudburst для блокування огляду'],
  },
  {
    name: 'Reyna',
    role: 'Duelist',
    difficulty: 'Medium',
    playstyle: { aggression: 10, teamplay: 2, utility: 2, versatility: 5 },
    bestFor: ['Агресивна соло гра', 'Fragging', 'Entry fragging', 'Клатчі', 'Carry потенціал'],
    description: 'Найсильніший соло-дуеліст. Стає дуже сильною після першого вбивства.',
    tips: ['Потребує постійних вбивств', 'Leer перед входом', 'Devour для хілу, Dismiss для агресії'],
  },
  {
    name: 'Raze',
    role: 'Duelist',
    difficulty: 'Medium',
    playstyle: { aggression: 9, teamplay: 5, utility: 7, versatility: 8 },
    bestFor: ['Агресивна гра', 'Clearing углов', 'Пошкодження території', 'Entry fragging'],
    description: 'Універсальний дуеліст з великою кількістю пошкоджень.',
    tips: ['Blast Pack для мобільності', 'Boom Bot для інформації', 'Paint Shells для post-plant'],
  },
  {
    name: 'Phoenix',
    role: 'Duelist',
    difficulty: 'Easy',
    playstyle: { aggression: 8, teamplay: 6, utility: 6, versatility: 9 },
    bestFor: ['Початківці', 'Самодостатня гра', 'Хіл', 'Універсальність'],
    description: 'Найкращий дуеліст для початківців. Може хілитись.',
    tips: ['Hot Hands для хілу', 'Curveball для сліплення', 'Ultimate для агресивної інформації'],
  },
  {
    name: 'Yoru',
    role: 'Duelist',
    difficulty: 'Hard',
    playstyle: { aggression: 7, teamplay: 4, utility: 8, versatility: 9 },
    bestFor: ['Креативна гра', 'Фланки', 'Обман', 'Соло гра', 'Досвідчені гравці'],
    description: 'Найскладніший дуеліст. Потребує креативності.',
    tips: ['Fake teleports для обману', 'Fakeout для інформації', 'Ultimate для фланків'],
  },
  {
    name: 'Neon',
    role: 'Duelist',
    difficulty: 'Medium',
    playstyle: { aggression: 9, teamplay: 5, utility: 5, versatility: 7 },
    bestFor: ['Швидкий темп', 'Рашинг', 'Мобільність', 'Агресивна гра'],
    description: 'Найшвидший агент у грі.',
    tips: ['Швидкість для входів', 'Fast Lane для руху', 'Slide для кутів'],
  },
  
  // CONTROLLERS
  {
    name: 'Omen',
    role: 'Controller',
    difficulty: 'Medium',
    playstyle: { aggression: 6, teamplay: 8, utility: 9, versatility: 10 },
    bestFor: ['Універсальність', 'Смоки', 'Телепорти', 'Креативна гра'],
    description: 'Найуніверсальніший контролер.',
    tips: ['Креативні смоки', 'Shrouded Step для позицій', 'Ultimate для фланків'],
  },
  {
    name: 'Brimstone',
    role: 'Controller',
    difficulty: 'Easy',
    playstyle: { aggression: 5, teamplay: 10, utility: 8, versatility: 7 },
    bestFor: ['Початківці', 'Командна гра', 'Пост-плант', 'Простота'],
    description: 'Найпростіший контролер.',
    tips: ['Плануй смоки заздалегідь', 'Stim Beacon для атаки', 'Incendiary для post-plant'],
  },
  {
    name: 'Viper',
    role: 'Controller',
    difficulty: 'Hard',
    playstyle: { aggression: 6, teamplay: 9, utility: 10, versatility: 8 },
    bestFor: ['Контроль території', 'Пост-плант', 'Сетапи', 'Командна гра'],
    description: 'Найсильніший для post-plant.',
    tips: ['Вивчи сетапи', 'Snake Bite для post-plant', 'Ultimate для retake'],
  },
  {
    name: 'Astra',
    role: 'Controller',
    difficulty: 'Hard',
    playstyle: { aggression: 4, teamplay: 10, utility: 10, versatility: 9 },
    bestFor: ['Командна гра', 'Стратегічне мислення', 'Контроль карти'],
    description: 'Найскладніший контролер.',
    tips: ['Плануй зірки', 'Gravity Well для стоп', 'Відмінна комунікація'],
  },
  
  // INITIATORS
  {
    name: 'Sova',
    role: 'Initiator',
    difficulty: 'Hard',
    playstyle: { aggression: 6, teamplay: 10, utility: 10, versatility: 9 },
    bestFor: ['Інформація', 'Командна гра', 'Пост-плант', 'Сетапи'],
    description: 'Найкращий для інформації.',
    tips: ['Вивчи recon lineups', 'Shock Dart для пошкодження', 'Ultimate для post-plant'],
  },
  {
    name: 'Breach',
    role: 'Initiator',
    difficulty: 'Medium',
    playstyle: { aggression: 8, teamplay: 9, utility: 9, versatility: 7 },
    bestFor: ['Агресивна гра', 'Виконання', 'Стани крізь стіни'],
    description: 'Агресивний ініціатор.',
    tips: ['Flashpoint для сліплення', 'Aftershock для clearing', 'Координація з командою'],
  },
  {
    name: 'Skye',
    role: 'Initiator',
    difficulty: 'Medium',
    playstyle: { aggression: 7, teamplay: 10, utility: 9, versatility: 10 },
    bestFor: ['Командна гра', 'Хіл', 'Інформація', 'Універсальність'],
    description: 'Найуніверсальніший ініціатор.',
    tips: ['Guiding Light найкращі флеші', 'Regrowth для хілу', 'Ultimate для пошуку'],
  },
  {
    name: 'KAY/O',
    role: 'Initiator',
    difficulty: 'Easy',
    playstyle: { aggression: 8, teamplay: 8, utility: 8, versatility: 9 },
    bestFor: ['Початківці', 'Саппресія', 'Флеші', 'Універсальність'],
    description: 'Простий і ефективний.',
    tips: ['FLASH/drive для сліплення', 'ZERO/point для вимкнення здібностей'],
  },
  {
    name: 'Fade',
    role: 'Initiator',
    difficulty: 'Medium',
    playstyle: { aggression: 6, teamplay: 9, utility: 10, versatility: 8 },
    bestFor: ['Інформація', 'Контроль території', 'Послаблення'],
    description: 'Інформаційний ініціатор.',
    tips: ['Haunt для інформації', 'Seize для утримання', 'Ultimate для retake'],
  },
  {
    name: 'Gekko',
    role: 'Initiator',
    difficulty: 'Easy',
    playstyle: { aggression: 7, teamplay: 8, utility: 8, versatility: 9 },
    bestFor: ['Початківці', 'Універсальність', 'Спайк плант'],
    description: 'Веселий та простий.',
    tips: ['Wingman може садити спайк', 'Dizzy для сліплення', 'Підбирай істот'],
  },
  
  // SENTINELS
  {
    name: 'Sage',
    role: 'Sentinel',
    difficulty: 'Easy',
    playstyle: { aggression: 4, teamplay: 10, utility: 8, versatility: 8 },
    bestFor: ['Початківці', 'Хіл', 'Захист', 'Командна підтримка'],
    description: 'Найкращий сентинель для початківців.',
    tips: ['Barrier для блокування', 'Slow Orb для затримки', 'Ultimate змінює раунд'],
  },
  {
    name: 'Cypher',
    role: 'Sentinel',
    difficulty: 'Hard',
    playstyle: { aggression: 3, teamplay: 9, utility: 10, versatility: 7 },
    bestFor: ['Інформація', 'Захист флангів', 'Сетапи', 'Пост-плант'],
    description: 'Інформаційний сентинель.',
    tips: ['Вивчи one-way setups', 'Spycam для фланків', 'Ultimate показує ворогів'],
  },
  {
    name: 'Killjoy',
    role: 'Sentinel',
    difficulty: 'Medium',
    playstyle: { aggression: 4, teamplay: 9, utility: 10, versatility: 8 },
    bestFor: ['Пост-плант', 'Захист точок', 'Сетапи', 'Пошкодження'],
    description: 'Найкращий для post-plant.',
    tips: ['Turret для інформації', 'Nanoswarm для post-plant', 'Ultimate для затримки'],
  },
  {
    name: 'Chamber',
    role: 'Sentinel',
    difficulty: 'Hard',
    playstyle: { aggression: 8, teamplay: 6, utility: 6, versatility: 7 },
    bestFor: ['Операторська гра', 'Агресивна гра', 'Фраггінг', 'Aim'],
    description: 'Агресивний сентинель.',
    tips: ['Оператор з телепортом', 'Trademark для фланків', 'Ultimate гарантовані вбивства'],
  },
];
