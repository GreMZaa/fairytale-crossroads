/**
 * @file game.ts
 * Модели данных и типы для игры в визуальном стиле Tile Family («Спасение и Обустройство»)
 */

export interface DialogueMessage {
  speaker: string;
  text: string;
  avatar: string;
  ribbonColor?: 'blue' | 'red' | 'gold';
}

export interface RenovationHotspot {
  id: string;
  title: string;
  costStars: number;
  iconType: 'hammer' | 'window' | 'wrench' | 'table' | 'rug' | 'bed' | 'lamp';
  x: number; // % from left
  y: number; // % from top
}

export interface RenovationStage {
  step: number; // 0 to 12
  background: string;
  title: string;
  dialogues: DialogueMessage[];
  hotspot?: RenovationHotspot;
  isCompleted?: boolean;
}

export interface TileItem {
  id: string;
  typeId: number;
  icon: string;
  name: string;
  color: string;
}

export interface UserStats {
  light_path: number;
  dark_path: number;
  courage: number;
  cunning: number;
  prince_affinity: number;
}

export interface UserProfile {
  id: string;
  telegram_id: number;
  username?: string;
  first_name: string;
  stars: number;
  coins: number;
  lives: number;
  crystals: number;
  keys: number;
  renovationStep: number; // 0 to 12
  stats: UserStats;
}

export type ChoiceType = 'standard' | 'fail' | 'premium';

export interface PuzzleChoice {
  id: string;
  text: string;
  item_icon: string;
  type: ChoiceType;
  cost: number;
  allow_ad?: boolean;
  result: 'success' | 'fail' | 'premium_success';
  feedback_text: string;
  next_node: string;
}

export interface TimerRescue {
  title: string;
  duration_seconds: number;
  free_action_text: string;
  speedup_ad_text: string;
  speedup_crystal_cost: number;
  next_node: string;
}

export interface EpisodeNode {
  id: string;
  title: string;
  background: string;
  bg_music?: string;
  ambient?: string;
  character?: any;
  dialogue?: any;
  puzzle?: any;
  timer_rescue?: TimerRescue;
  summary?: any;
}

