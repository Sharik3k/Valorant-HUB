import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processUserMessage } from './aiService';
import { initializeAgentVectors, initializePlayerVectors, searchAgents, searchPlayers, hybridSearchPlayers } from './vectorSearchService';

dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Valorant HUB AI Server is running!');
});

app.post('/api/search/agents', async (req, res) => {
  try {
    const { query, topK } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const results = await searchAgents(query, topK);
    res.json(results);
  } catch (error) {
    console.error('Error in agent vector search:', error);
    res.status(500).json({ error: 'Failed to perform agent vector search' });
  }
});

app.post('/api/search/players', async (req, res) => {
  try {
    const { query, topK } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const results = await searchPlayers(query, topK);
    res.json(results);
  } catch (error) {
    console.error('Error in player vector search:', error);
    res.status(500).json({ error: 'Failed to perform player vector search' });
  }
});

app.post('/api/search/hybrid', async (req, res) => {
  try {
    const { query, topK } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const results = await hybridSearchPlayers(query, topK);
    res.json(results);
  } catch (error) {
    console.error('Error in hybrid search:', error);
    res.status(500).json({ error: 'Failed to perform hybrid search' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const userMessage = messages[messages.length - 1].content;
    console.log('Received message:', userMessage);
    const result = await processUserMessage(userMessage);
    console.log('AI Response:', result);
    
    res.json(result);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('\n=== Initializing Vector Search ===');
  
  // Initialize vectors on server startup
  try {
    console.log('Initializing agent vectors...');
    await initializeAgentVectors();
    
    console.log('Initializing player vectors (this may take a while)...');
    await initializePlayerVectors();
    
    console.log('\n=== Vector Search Ready ===');
    console.log('Available endpoints:');
    console.log('  POST /api/search/agents - Search for agents');
    console.log('  POST /api/search/players - Vector search for players');
    console.log('  POST /api/search/hybrid - Hybrid search for players');
    console.log('  POST /api/chat - AI chat assistant');
  } catch (error) {
    console.error('Failed to initialize vectors:', error);
  }
});
