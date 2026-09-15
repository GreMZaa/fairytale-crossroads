/**
 * @file game.ts
 * Модели данных и DTO для интерактивной новеллы «Сказки: Перекрестки Судеб»
 */

export type CharacterEmotion = 'normal' | 'shivering' | 'determined' | 'happy' | 'triumphant' | 'heroic';
export type ChoiceType = 'standard' | 'fail' | 'premium';

export interface CharacterSprite {
  id: string;
  name: string;
  emotion: CharacterEmotion;
  avatar: string;
  position: 'left' | 'center' | 'right';
}

export interface Dialogue {
  speaker: string;
  text: string;
}

export interface StatChanges {
  light_path?: number;
  dark_path?: number;
  courage?: number;
  cunning?: number;
  prince_affinity?: number;
}

export interface PuzzleChoice {
  id: string;
  text: string;
  item_icon: string;
  type: ChoiceType;
  cost: number;
  allow_ad?: boolean;
  result: 'success' | 'fail' | 'premium_success';
  feedback_text: string;
  sound_sfx?: string;
  bonus_text?: string;
  companion_reaction?: string;
  next_node: string;
  stat_changes: StatChanges;
}

export interface Puzzle {
  problem_title: string;
  description: string;
  choices: PuzzleChoice[];
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
  character?: CharacterSprite;
  dialogue?: Dialogue;
  puzzle?: Puzzle;
  timer_rescue?: TimerRescue;
  summary?: {
    title: string;
    reward_crystals: number;
    next_episode_id?: string;
  };
}

export interface StoryEpisode {
  id: string;
  story_id: string;
  episode_number: number;
  title: string;
  description: string;
  initial_node_id: string;
  nodes: Record<string, EpisodeNode>;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  tag: string;
  is_active: boolean;
  episodes?: StoryEpisode[];
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
  first_name?: string;
  crystals: number;
  keys: number;
  stats: UserStats;
}

export interface UserProgressState {
  story_id: string;
  current_episode_id: string;
  current_node_id: string;
  completed_nodes: string[];
  purchased_choices: string[];
  unlocked_items: string[];
  timer_ends_at?: string | null;
}

/**
 * DTO для сохранения прогресса (клиент -> сервер)
 * Защита от Mass Assignment: нельзя передавать crystals или stats напрямую
 */
export interface SaveProgressPayload {
  story_id: string;
  episode_id: string;
  choice_id: string;
  node_id: string;
}

export interface SaveProgressResponse {
  success: boolean;
  next_node_id: string;
  updated_stats: UserStats;
  crystals: number;
  keys: number;
  feedback_text?: string;
  error?: string;
}

export interface AdRewardResponse {
  success: boolean;
  reward_crystals: number;
  new_balance: number;
  error?: string;
}
