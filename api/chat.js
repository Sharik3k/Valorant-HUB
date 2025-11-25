const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'You are a helpful AI assistant for VALORANT HUB. Your name is Astra. You must answer only in Ukrainian. Your main goal is to help players with questions about agents, maps, weapons, and strategies in Valorant. You should be friendly and helpful.' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Привіт! Я Астра, AI-асистент VALORANT HUB. Чим можу допомогти сьогодні?' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
