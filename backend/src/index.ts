import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processUserMessage } from './aiService';

dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Valorant HUB AI Server is running!');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message);
    const result = await processUserMessage(message);
    console.log('AI Response:', result);
    
    res.json(result);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
