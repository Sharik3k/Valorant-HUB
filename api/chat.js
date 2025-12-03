const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const providedMessages = Array.isArray(body.messages) ? body.messages : null;
    const singleMessage = typeof body.message === 'string' ? body.message : null;
    const incomingThreadId = typeof body.threadId === 'string' ? body.threadId : null;

    const systemMessage = {
      role: 'system',
      content: 'You are a helpful AI assistant for VALORANT HUB. Your name is Astra. You must answer only in Ukrainian. Your main goal is to help players with questions about agents, maps, weapons, and strategies in Valorant. You should be friendly and helpful.',
    };

    const chatMessages = providedMessages
      ? [systemMessage, ...providedMessages]
      : singleMessage
      ? [systemMessage, { role: 'user', content: singleMessage }]
      : null;

    if (!chatMessages) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages: chatMessages,
      max_tokens: 1000,
    });

    const reply = completion.choices?.[0]?.message?.content || '';
    const outThreadId = incomingThreadId || Date.now().toString();

    res.status(200).json({ message: reply, threadId: outThreadId });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
