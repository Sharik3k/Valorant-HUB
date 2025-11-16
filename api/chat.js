// Vercel Serverless Function для безпечної роботи з OpenAI API
// API ключ зберігається на сервері і не доступний в браузері

const OpenAI = require('openai');
const { availableTools, toolDefinitions } = require('./tools');

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
    const systemPrompt = 'AI асистент VALORANT HUB. Відповідай коротко українською або англійською. Допомагай з питаннями про агентів, мапи, зброю та стратегії. Ти маєш доступ до інструментів для отримання статистики гравців та пошуку. Використовуй їх коли потрібно.';

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

    // Конвертувати toolDefinitions в формат OpenAI tools
    const tools = toolDefinitions.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));

    // Відправити повідомлення до OpenAI з tools
    let completion = await openai.chat.completions.create({
      model: modelName,
      messages: formattedMessages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: 'auto', // Модель сама вирішує чи викликати функцію
      temperature: 0.7,
      max_tokens: 500,
    });

    let assistantMessage = completion.choices[0]?.message;
    let finalResponse = assistantMessage.content || '';

    // Обробка function calling
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log(`[Chat API] Викликано ${assistantMessage.tool_calls.length} інструментів`);

      // Додаємо повідомлення асистента з tool_calls до історії
      formattedMessages.push(assistantMessage);

      // Виконуємо всі виклики інструментів
      const toolResults = [];
      
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`[Chat API] Виклик функції: ${functionName}`, functionArgs);

        try {
          // Викликаємо функцію з availableTools
          if (!availableTools[functionName]) {
            throw new Error(`Функція ${functionName} не знайдена`);
          }

          const functionResult = await availableTools[functionName](functionArgs);
          
          // Додаємо результат до масиву
          toolResults.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: functionResult, // Вже JSON string з tools.js
          });
        } catch (error) {
          console.error(`[Chat API] Помилка виконання ${functionName}:`, error);
          toolResults.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ 
              error: `Помилка виконання функції: ${error.message}` 
            }),
          });
        }
      }

      // Додаємо результати виконання функцій до історії
      formattedMessages.push(...toolResults);

      // Відправляємо результати назад до моделі для формування фінальної відповіді
      completion = await openai.chat.completions.create({
        model: modelName,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500,
      });

      finalResponse = completion.choices[0]?.message?.content || 'Не вдалося сформувати відповідь';
    }

    if (!finalResponse) {
      throw new Error('Empty response from AI');
    }

    // Повернути відповідь клієнту
    return res.status(200).json({
      message: finalResponse,
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
      
      // Перевірка на помилки провайдера
      if (errorMessage.includes('Provider returned error')) {
        statusCode = 503;
        errorMessage = 'AI модель тимчасово недоступна. Спробуйте іншу модель або зачекайте кілька хвилин.';
      }
    }
    
    return res.status(statusCode).json({
      error: errorMessage,
    });
  }
};
