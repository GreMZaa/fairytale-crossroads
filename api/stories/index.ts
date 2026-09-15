/**
 * @file index.ts
 * @route GET /api/stories
 * Возвращает список доступных историй и текущих глав
 */

import { INITIAL_STORIES } from '../lib/storyData';

export async function handleGetStories() {
  return {
    success: true,
    stories: INITIAL_STORIES.filter(s => s.is_active)
  };
}
