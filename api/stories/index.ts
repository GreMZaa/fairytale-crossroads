/**
 * @file index.ts
 * @route GET /api/stories
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { INITIAL_STORIES } from '../lib/storyData';

export async function handleGetStories() {
  return {
    success: true,
    stories: INITIAL_STORIES.filter(s => s.is_active)
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const result = await handleGetStories();
  return res.status(200).json(result);
}
