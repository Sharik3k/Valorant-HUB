// Vercel Serverless Function для безпечної роботи з Gemini API
// API ключ зберігається на сервері і не доступний в браузері

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { availableTools, toolDefinitions } = require('./tools');

// Простий in-memory кеш для rate limiting
const requestCache = new Map();
const RATE_LIMIT_WINDOW = 60000; // 60 секунд
const MAX_REQUESTS_PER_WINDOW = 2; // Максимум 2 запити за хвилину

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
  
  // Додаємо новий запит
  recentRequests.push(now);
  requestCache.set(identifier, recentRequests);
  
  return { allowed: true };
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
    // Rate limiting перевірка
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const rateLimitCheck = checkRateLimit(clientIp);
    
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        error: `Перевищено ліміт запитів. Спробуйте через ${rateLimitCheck.waitTime} секунд. Безкоштовні моделі мають обмеження.`,
        retryAfter: rateLimitCheck.waitTime,
      });
    }
    
    // Отримати API ключ з Environment Variables (безпечно, тільки на сервері)
    const apiKey = process.env.GEMINI_API_KEY;
    // Використовуємо Gemini 2.0 Flash - швидка і безкоштовна модель
    const modelName = process.env.AI_MODEL || 'gemini-2.0-flash-exp';

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Gemini API key не налаштовано на сервері' 
      });
    }

    // Отримати повідомлення з запиту
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Системний промпт (оптимізовано для економії токенів)
    const systemPrompt = 'AI асистент VALORANT HUB. Відповідай коротко українською або англійською.';

    // Ініціалізувати Gemini клієнт
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: toolDefinitions }],
    });

    // Конвертувати повідомлення в формат Gemini
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Створити чат сесію
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500, // Оптимізовано для економії токенів
      },
    });

    // Відправити повідомлення і обробити можливі виклики функцій
    let result = await chat.sendMessage(lastMessage.content);
    let response = result.response;

    while (response.functionCalls) {
      const calls = response.functionCalls;
      
      // Паралельно виконуємо всі виклики інструментів
      const functionResponses = await Promise.all(
        calls.map(async (call) => {
          const { name, args } = call;
          const fn = availableTools[name];
          if (!fn) {
            // Якщо інструмент не знайдено, повертаємо помилку
            return {
              name,
              response: {
                content: JSON.stringify({ error: `Tool ${name} not found.` }),
              },
            };
          }
          // Викликаємо асинхронну функцію інструмента з правильними аргументами
          const toolResult = await fn(args);
          return {
            name,
            response: {
              content: toolResult,
            },
          };
        })
      );

      // Надіслати відповіді від інструментів назад до моделі
      result = await chat.sendMessage(JSON.stringify(functionResponses));
      response = result.response;
    }

    const text = response.text();

    if (!text) {
      throw new Error('Empty response from AI');
    }

    // Повернути відповідь клієнту
    return res.status(200).json({
      message: text,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
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
