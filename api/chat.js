// Vercel Serverless Function для безпечної роботи з OpenRouter API
// API ключ зберігається на сервері і не доступний в браузері

const OpenAI = require('openai');

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
    // Отримати API ключ з Environment Variables (безпечно, тільки на сервері)
    const apiKey = process.env.OPENROUTER_API_KEY;
    // Використовуємо найкращу безкоштовну модель - Google Gemini 2.0 Flash
    const model = process.env.AI_MODEL || 'google/gemini-2.0-flash-exp:free';

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenRouter API key не налаштовано на сервері' 
      });
    }

    // Отримати повідомлення з запиту
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Додати системний промпт
    const systemMessage = {
      role: 'system',
      content: 'Ти — AI асистент для VALORANT HUB. Допомагаєш гравцям з питаннями про гру VALORANT: агенти, мапи, зброя, стратегії, VCT змагання. Відповідай коротко та по суті українською мовою та англійською мовою, залежно від мови якою робить запит користувач.'
    };

    // Ініціалізувати OpenAI клієнт для OpenRouter
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'http://localhost:5173',
        'X-Title': 'VALORANT HUB AI Assistant',
      }
    });

    // Виконати запит до OpenRouter API
    const response = await openai.chat.completions.create({
      model,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('Empty response from AI');
    }

    // Повернути відповідь клієнту
    return res.status(200).json({
      message: response.choices[0].message.content,
      usage: response.usage,
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
