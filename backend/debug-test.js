const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Debug server is running!' });
});

app.post('/api/chat', (req, res) => {
  console.log('📨 POST /api/chat received');
  console.log('Request body:', req.body);
  
  const { message } = req.body;
  
  if (!message) {
    console.log('❌ No message found');
    return res.status(400).json({ 
      error: 'Message is required',
      receivedBody: req.body 
    });
  }
  
  console.log('✅ Message received:', message);
  res.json({ 
    reply: `Echo: ${message}`,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 Debug server running on http://localhost:${port}`);
  console.log('📝 Ready to test POST requests...');
});
