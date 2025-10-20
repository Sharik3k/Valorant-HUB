import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function для OpenRouter API
 * API ключ захищений на сервері - клієнт його не бачить!
 */

interface ChatRequest {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Дозволити тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { messages, model, temperature, max_tokens, top_p, stream }: ChatRequest = req.body;

    // Валідація
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    // API ключ береться з змінних оточення СЕРВЕРУ
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('⚠️ OPENROUTER_API_KEY not set in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error: API key not configured' 
      });
    }

    // Запит до OpenRouter API
    const requestBody = {
      model: model || process.env.DEFAULT_AI_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
      messages,
      temperature: temperature ?? 0.1,
      max_tokens: max_tokens ?? 4000,
      top_p: top_p ?? 1,
      stream: stream || false,
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || req.headers.referer || '',
        'X-Title': process.env.APP_NAME || 'Valorant-HUB',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || `OpenRouter API Error: ${response.statusText}`,
      });
    }

    // Якщо stream, передаємо відповідь як є
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // @ts-ignore - Node stream
      response.body?.pipe(res);
      return;
    }

    // Звичайна відповідь
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
