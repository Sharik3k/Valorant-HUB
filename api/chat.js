// Vercel Serverless Function для безпечної роботи з Gemini API
// API ключ зберігається на сервері і не доступний в браузері

const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    const apiKey = process.env.GEMINI_API_KEY;

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

    // Ініціалізувати Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Сформувати промпт з усіх повідомлень
    const systemPrompt = 'Ти — AI асистент для VALORANT HUB. Допомагаєш гравцям з питаннями про гру VALORANT: агенти, мапи, зброя, стратегії, VCT змагання. Відповідай коротко та по суті українською мовою та англійською мовою, залежно від мови якою робить запит користувач.';
    
    // Об'єднати всі повідомлення в один промпт
    const userMessages = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n');
    
    const fullPrompt = `${systemPrompt}\n\nКористувач: ${userMessages}`;

    // Виконати запит до Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    // Повернути відповідь клієнту
    return res.status(200).json({
      message: text,
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
