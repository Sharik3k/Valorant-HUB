// Vercel Serverless Function для безпечної роботи з OpenAI API
// API ключ зберігається на сервері і не доступний в браузері

const OpenAI = require('openai');
// Tools відключені для стабільності - можна увімкнути пізніше
// const { availableTools, toolDefinitions } = require('./tools');

// Простий in-memory кеш для rate limiting
const requestCache = new Map();
const RATE_LIMIT_WINDOW = 120000; // 120 секунд (2 хвилини)
const MAX_REQUESTS_PER_WINDOW = 3; // Максимум 3 запити за 2 хвилини

function checkRateLimit(identifier) {
  const now = Date.now();
  const userRequests = requestCache.get(identifier) || [];
  
  // Видаляємо старі запити
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestRequest = Math.min(...recentRequests);
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestRequest)) / 1000);
    return { allowed: false, waitTime };
  }
  
  // Додаємо новий запит ПІСЛЯ успішного виконання
  return { allowed: true, recentRequests };
}

function recordRequest(identifier, recentRequests) {
  recentRequests.push(Date.now());
  requestCache.set(identifier, recentRequests);
}

module.exports = async (req, res) => {
  // CORS headers для локального розвитку
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Обробка OPTIONS запиту (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Дозволити тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting перевірка (м'яка - дозволяємо спробувати)
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const rateLimitCheck = checkRateLimit(clientIp);
    
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        error: `⏳ Перевищено ліміт запитів на сервері. Спробуйте через ${rateLimitCheck.waitTime} секунд.`,
        retryAfter: rateLimitCheck.waitTime,
      });
    }
    
    // Отримати API ключ з Environment Variables (безпечно, тільки на сервері)
    const apiKey = process.env.OPENAI_API_KEY;
    // Використовуємо GPT-4o-mini - швидка і економна модель
    const modelName = process.env.AI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key не налаштовано на сервері' 
      });
    }

    // Отримати повідомлення з запиту
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Системний промпт (оптимізовано для економії токенів)
    const systemPrompt = 'AI асистент VALORANT HUB. Відповідай коротко українською або англійською. Допомагай з питаннями про агентів, мапи, зброю та стратегії.';

    // Ініціалізувати OpenAI клієнт
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Конвертувати повідомлення в формат OpenAI
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    ];

    // Відправити повідомлення до OpenAI
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500, // Оптимізовано для економії токенів
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error('Empty response from AI');
    }

    // Записуємо запит ТІЛЬКИ після успішної відповіді
    recordRequest(clientIp, rateLimitCheck.recentRequests);

    // Повернути відповідь клієнту
    return res.status(200).json({
      message: text,
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Обробка специфічних помилок
    let statusCode = 500;
    let errorMessage = 'Unknown error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Перевірка на rate limit (429)
      if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
        statusCode = 429;
        errorMessage = 'Перевищено ліміт запитів. Спробуйте через 1-2 хвилини. Безкоштовні моделі мають обмеження на кількість запитів.';
      }
      // Перевірка на помилки провайдера
      else if (errorMessage.includes('Provider returned error')) {
        statusCode = 503;
        errorMessage = 'AI модель тимчасово недоступна. Спробуйте іншу модель або зачекайте кілька хвилин.';
      }
    }
    
    return res.status(statusCode).json({
      error: errorMessage,
      retryAfter: statusCode === 429 ? 60 : undefined, // Рекомендуємо зачекати 60 секунд
    });
  }
};
