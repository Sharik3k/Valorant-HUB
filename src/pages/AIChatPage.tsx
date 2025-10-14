// AI Chat Page with OpenRouter Integration
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Fab,
  Button,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Send,
  Delete,
  Home,
  SaveAlt,
  Psychology,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import PlaystyleQuiz from '../components/PlaystyleQuiz';
import { Message, ChatState } from '../types/chat';
import { createOpenRouterService } from '../services/openrouter';
import { PlaystyleAnswers, generateAnalysisText, recommendAgents } from '../utils/agent-recommender';

const AI_SYSTEM_PROMPT = `You are an expert VALORANT coach and AI assistant for VALORANT HUB. You have deep knowledge about all VALORANT agents, their abilities, playstyles, and strategies.

IMPORTANT LANGUAGE RULE:
- You can ONLY respond in Ukrainian (українська) or English
- NEVER use Russian language in your responses
- If user writes in Ukrainian, respond in Ukrainian
- If user writes in English, respond in English
- If user writes in Russian, politely respond in Ukrainian or English

Your expertise includes:
- Detailed knowledge of all 24+ VALORANT agents (Duelists, Controllers, Initiators, Sentinels)
- Agent recommendations based on playstyle (aggressive/passive, solo/team, aim/utility focused)
- Map strategies and callouts
- Weapon recommendations and economy management
- Rank progression tips and game sense development

When giving agent recommendations:
1. Consider the player's playstyle (aggression, teamplay preference, focus)
2. Match difficulty to their experience level
3. Explain WHY an agent suits them
4. Give specific tips for that agent

Be friendly, encouraging, and provide actionable advice. Use emojis occasionally for engagement. Format responses with clear structure using bullet points and sections when helpful.`;

const AIChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [inputValue, setInputValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'info' });
  
  // Playstyle analysis state
  const [currentTab, setCurrentTab] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [playstyleResults, setPlaystyleResults] = useState<PlaystyleAnswers | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    setInputValue('');

    try {
      const service = createOpenRouterService();
      
      // Prepare messages for API
      const apiMessages = [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        ...chatState.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: userMessage.content },
      ];

      // Send message and get response
      const response = await service.sendMessage(apiMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Помилка відправки повідомлення';
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
    showSnackbar('Chat cleared', 'info');
  };

  const exportChat = () => {
    const chatData = {
      messages: chatState.messages,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valorant-hub-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSnackbar('Чат експортовано', 'success');
  };

  // Handle playstyle quiz completion
  const handleQuizComplete = (answers: PlaystyleAnswers) => {
    setPlaystyleResults(answers);
    setShowQuiz(false);
    
    // Generate analysis text
    const analysis = generateAnalysisText(answers);
    setAnalysisText(analysis);
    
    // Save to localStorage
    localStorage.setItem('playstyle_results', JSON.stringify(answers));
    
    showSnackbar('Аналіз завершено! Перегляньте рекомендації нижче', 'success');
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleCancelQuiz = () => {
    setShowQuiz(false);
  };

  const handleResetAnalysis = () => {
    setPlaystyleResults(null);
    setAnalysisText('');
    localStorage.removeItem('playstyle_results');
    showSnackbar('Аналіз скинуто', 'info');
  };

  // Load saved playstyle results
  useEffect(() => {
    const saved = localStorage.getItem('playstyle_results');
    if (saved) {
      try {
        const results = JSON.parse(saved);
        setPlaystyleResults(results);
        setAnalysisText(generateAnalysisText(results));
      } catch (e) {
        console.error('Failed to load playstyle results', e);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e13 0%, #1a1f2e 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'rgba(26, 31, 46, 0.8)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <Home />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            AI Chat Assistant
          </Typography>
          {currentTab === 0 && (
            <>
              <IconButton color="inherit" onClick={exportChat} disabled={chatState.messages.length === 0} sx={{ mr: 1 }}>
                <SaveAlt />
              </IconButton>
              <IconButton color="inherit" onClick={clearChat} disabled={chatState.messages.length === 0}>
                <Delete />
              </IconButton>
            </>
          )}
        </Toolbar>
        
        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 600,
            },
            '& .Mui-selected': {
              color: 'primary.main',
            },
          }}
        >
          <Tab label="💬 AI Чат" />
          <Tab
            label="🎯 Аналіз Стилю Гри"
            icon={playstyleResults ? <Chip label="Завершено" size="small" color="success" sx={{ ml: 1 }} /> : undefined}
            iconPosition="end"
          />
        </Tabs>
      </AppBar>

      {/* Content Container */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 3 }}>
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'rgba(26, 31, 46, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          }}
        >
          {/* Tab Content */}
          {currentTab === 0 ? (
            <>
              {/* AI Chat Tab */}
              <Box
                ref={chatContainerRef}
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  py: 2,
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { background: 'rgba(0,0,0,0.1)' },
                  '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: '4px' },
                }}
              >
                {chatState.messages.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', px: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                      Вітаю в AI Чаті
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', mb: 3 }}>
                      Запитай мене про VALORANT агентів, стратегії або поради!
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {['Розкажи про агентів VALORANT', 'Поради для початківців', 'Стратегії карт', 'Як покращити aim?'].map((suggestion) => (
                        <Button key={suggestion} variant="outlined" size="small" onClick={() => setInputValue(suggestion)} sx={{ borderRadius: 2 }}>
                          {suggestion}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <>
                    {chatState.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {chatState.isLoading && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Напиши своє повідомлення..."
                    disabled={chatState.isLoading}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 } }}
                  />
                  <Fab color="primary" size="medium" onClick={handleSendMessage} disabled={chatState.isLoading || !inputValue.trim()}>
                    <Send />
                  </Fab>
                </Box>
              </Box>
            </>
          ) : (
            <>
              {/* Playstyle Analysis Tab */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                {showQuiz ? (
                  <PlaystyleQuiz onComplete={handleQuizComplete} onCancel={handleCancelQuiz} />
                ) : playstyleResults ? (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        Результати Аналізу
                      </Typography>
                      <Button variant="outlined" startIcon={<Psychology />} onClick={handleStartQuiz}>
                        Пройти знову
                      </Button>
                    </Box>
                    
                    {/* Recommendations */}
                    {recommendAgents(playstyleResults, 5).map((agent, index) => (
                      <Card key={agent.name} sx={{ mb: 2, bgcolor: 'rgba(26, 31, 46, 0.8)', border: '1px solid rgba(255, 70, 85, 0.3)' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              #{index + 1} {agent.name}
                            </Typography>
                            <Chip label={agent.role} size="small" sx={{ ml: 2 }} />
                            <Chip label={agent.difficulty} size="small" color={agent.difficulty === 'Easy' ? 'success' : agent.difficulty === 'Medium' ? 'warning' : 'error'} sx={{ ml: 1 }} />
                          </Box>
                          
                          <Typography variant="body1" paragraph>
                            {agent.description}
                          </Typography>
                          
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'secondary.main' }}>
                            ✅ Чому підходить:
                          </Typography>
                          {agent.matchReasons.map((reason, i) => (
                            <Typography key={i} variant="body2" sx={{ mb: 0.5, pl: 2 }}>
                              • {reason}
                            </Typography>
                          ))}
                          
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, mt: 2, color: 'secondary.main' }}>
                            💡 Поради:
                          </Typography>
                          {agent.tips.slice(0, 3).map((tip, i) => (
                            <Typography key={i} variant="body2" sx={{ mb: 0.5, pl: 2 }}>
                              • {tip}
                            </Typography>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleResetAnalysis}>
                      Скинути результати
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <Psychology sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Аналіз Стилю Гри
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 500 }}>
                      Пройди короткий тест (5 питань) і дізнайся, які агенти найкраще підходять під твій стиль гри в VALORANT!
                    </Typography>
                    <Button variant="contained" size="large" startIcon={<Psychology />} onClick={handleStartQuiz} sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
                      Почати Аналіз
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIChatPage;
