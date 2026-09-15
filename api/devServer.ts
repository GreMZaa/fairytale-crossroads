/**
 * @file devServer.ts
 * Vite Plugin / Middleware для обработки серверных маршрутов /api/*
 */

import type { Plugin, ViteDevServer } from 'vite';
import { handleGetStories } from './stories/index.js';
import { handleSaveProgress } from './progress/save.js';
import { handleAdReward } from './ads/reward.js';
import { handleGetProfile } from './profile/index.js';
import { handleBotWebhook } from './bot/webhook.js';

export function gameApiPlugin(): Plugin {
  return {
    name: 'game-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');

        // Читаем body для POST-запросов
        let body: any = {};
        if (req.method === 'POST') {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
          }
        }

        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        try {
          if (pathname === '/api/stories' && req.method === 'GET') {
            const data = await handleGetStories();
            res.statusCode = 200;
            return res.end(JSON.stringify(data));
          }

          if (pathname === '/api/profile' && req.method === 'POST') {
            const result = await handleGetProfile(body, botToken);
            res.statusCode = result.status;
            return res.end(JSON.stringify(result.body));
          }

          if (pathname === '/api/progress/save' && req.method === 'POST') {
            const result = await handleSaveProgress(body, botToken);
            res.statusCode = result.status;
            return res.end(JSON.stringify(result.body));
          }

          if (pathname === '/api/ads/reward' && req.method === 'POST') {
            const result = await handleAdReward(body, botToken);
            res.statusCode = result.status;
            return res.end(JSON.stringify(result.body));
          }

          if (pathname === '/api/bot/webhook' && req.method === 'POST') {
            const secret = req.headers['x-telegram-bot-api-secret-token'] as string;
            const result = await handleBotWebhook(body, secret);
            res.statusCode = result.status;
            return res.end(JSON.stringify(result.body));
          }

          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Endpoint not found' }));
        } catch {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
      });
    }
  };
}
