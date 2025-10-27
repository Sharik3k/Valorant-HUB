import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

console.log('=== DEBUG INFO ===');
console.log('Current working directory:', process.cwd());
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('PORT:', process.env.PORT);
console.log('==================');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Valorant HUB AI Test Server is running!',
    env: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET',
      PORT: process.env.PORT
    }
  });
});

app.post('/api/chat', (req, res) => {
  console.log('📨 Received POST request');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  const { message } = req.body;
  
  if (!message) {
    console.log('❌ No message in request body');
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // Mock response for testing
  const mockResponses = {
    'порадь агентів для ascent': {
      map: "Ascent",
      recommended_agents: [
        {agent: "Jett", role: "Duelist"},
        {agent: "Omen", role: "Controller"},
        {agent: "Sova", role: "Initiator"},
        {agent: "Killjoy", role: "Sentinel"}
      ]
    },
    'створи агресивну стратегію для bind': {
      map: "Bind",
      style: "aggressive",
      strategy: {
        site: "B",
        agents: ["Raze", "Yoru", "Viper"],
        steps: [
          "Raze entry з Double Satchel",
          "Viper ставить wall на B site",
          "Yoru телепортується за спину ворогів"
        ]
      }
    },
    'default': {
      reply: `Ви написали: "${message}". Це тестова відповідь без AI.`
    }
  };
  
  const lowerMessage = message.toLowerCase();
  const response = mockResponses[lowerMessage] || mockResponses['default'];
  
  console.log('✅ Mock response for:', message);
  res.json(response);
});

app.listen(port, () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
  console.log('📝 This is a mock server for testing frontend connection');
});
