const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const systemMessage = {
      role: 'system',
      content: 'You are a helpful AI assistant for VALORANT HUB. Your name is Astra. You must answer only in Ukrainian. Your main goal is to help players with questions about agents, maps, weapons, and strategies in Valorant. You should be friendly and helpful.',
    };

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
