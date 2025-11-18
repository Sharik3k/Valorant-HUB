// Vercel Serverless Function для роботи з OpenAI Assistants API

const OpenAI = require('openai');
const { availableTools } = require('./tools');

// Функція для очікування
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!apiKey || !assistantId) {
      return res.status(500).json({ error: 'OpenAI API key або Assistant ID не налаштовано' });
    }

    const { message, threadId: clientThreadId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Повідомлення не може бути порожнім' });
    }

    const openai = new OpenAI({ apiKey });

    // Створюємо нову розмову (thread), якщо її ID не передано
    const threadId = clientThreadId || (await openai.beta.threads.create()).id;

    // Додаємо повідомлення користувача до розмови
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Запускаємо асистента
    let run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Очікуємо завершення виконання
    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await sleep(500); // Пауза, щоб не спамити запитами
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    }

    // Якщо асистент вимагає викликати інструмент
    if (run.status === 'requires_action') {
      const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
      const toolOutputs = [];

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`[Assistants API] Виклик функції: ${functionName}`, functionArgs);

        if (availableTools[functionName]) {
          try {
            const result = await availableTools[functionName](functionArgs);
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: result, // Assistants API очікує рядок
            });
          } catch (error) {
             console.error(`[Assistants API] Помилка виконання ${functionName}:`, error);
             toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify({ error: `Помилка: ${error.message}` }),
             });
          }
        } else {
          toolOutputs.push({
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: `Функція ${functionName} не знайдена` }),
          });
        }
      }

      // Надсилаємо результати виконання інструментів
      run = await openai.beta.threads.runs.submitToolOutputs(run.thread_id, run.id, {
        tool_outputs: toolOutputs,
      });

      // Знову очікуємо завершення
      while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
        await sleep(500);
        run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
      }
    }

    // Якщо виконання успішне, отримуємо відповідь
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const assistantMessage = messages.data.find(m => m.role === 'assistant');

      if (assistantMessage && assistantMessage.content[0].type === 'text') {
        return res.status(200).json({
          message: assistantMessage.content[0].text.value,
          threadId: run.thread_id, // Повертаємо ID розмови для продовження
        });
      }
    }
    
    // Обробка помилок виконання
    console.error('Run Error:', run.status, run.last_error);
    return res.status(500).json({ 
      error: `Помилка виконання асистента. Статус: ${run.status}`,
      details: run.last_error?.message || 'Деталі невідомі',
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
};
