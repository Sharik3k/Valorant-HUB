import { useState, useRef, useEffect } from 'react';
import { ArrowDownRight, MessageCircle, Send, X, Minimize2, Loader2, AlertCircle } from 'lucide-react';
import { Box, IconButton, TextField, Typography, Paper, Fade } from '@mui/material';
import { aiService, Message } from '../services/aiService';

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cooldown timer
  useEffect(() => {
    if (cooldownUntil) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setCooldownUntil(null);
          setCooldownSeconds(0);
          setError(null);
        } else {
          setCooldownSeconds(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldownUntil]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Привітальне повідомлення
      setMessages([{
        id: '1',
        role: 'assistant',
        content: '👋 Привіт! Я AI асистент VALORANT HUB. Можу допомогти з питаннями про агентів, мапи, зброю та стратегії. Як можу допомогти?',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Перевірка cooldown
    if (cooldownUntil && Date.now() < cooldownUntil) {
      setError(`⏳ Зачекайте ще ${cooldownSeconds} секунд перед наступним запитом`);
      return;
    }

    if (!aiService.isConfigured()) {
      setError('OpenRouter API ключ не налаштовано. Перевірте .env файл.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Відправляємо всі повідомлення окрім системного привітання
      const conversationMessages = messages
        .filter(msg => msg.id !== '1')
        .map(({ role, content }) => ({ role, content }));
      
      const response = await aiService.sendMessage([
        ...conversationMessages,
        { role: userMessage.role, content: userMessage.content }
      ]);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Додаємо мінімальний cooldown між запитами (10 секунд для безпеки)
      setCooldownUntil(Date.now() + 10000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка при отриманні відповіді';
      
      // Перевірка на rate limit
      if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit') || errorMessage.includes('Перевищено ліміт')) {
        // Встановлюємо cooldown на 90 секунд (1.5 хвилини)
        setCooldownUntil(Date.now() + 90000);
        setError('⏳ Перевищено ліміт запитів Gemini API. Зачекайте 90 секунд. Безкоштовний tier має жорсткі обмеження.');
      } else {
        setError(errorMessage);
      }
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Box
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'white',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateY(0)',
            },
            '40%': {
              transform: 'translateY(-10px)',
            },
            '60%': {
              transform: 'translateY(-5px)',
            },
          },
          animation: 'bounce 2s infinite',
        }}
      >
        <Typography variant="button" sx={{ fontWeight: 700 }}>
          AI Assistant
        </Typography>
        <ArrowDownRight size={24} />
      </Box>
    );
  }

  return (
    <Fade in={isOpen}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: isMinimized ? 320 : 400,
          height: isMinimized ? 60 : 600,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'primary.main',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageCircle size={20} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              AI Асистент
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setIsMinimized(!isMinimized)}
              sx={{ color: 'white' }}
            >
              <Minimize2 size={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <X size={18} />
            </IconButton>
          </Box>
        </Box>

        {!isMinimized && (
          <>
            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: 'background.default',
              }}
            >
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>
              ))}

              {isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <Typography variant="body2" color="text.secondary">
                    Думаю...
                  </Typography>
                </Box>
              )}

              {error && (
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'error.dark',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <AlertCircle size={18} />
                  <Typography variant="body2">{error}</Typography>
                </Paper>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Напишіть повідомлення..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.default',
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || (cooldownUntil !== null && Date.now() < cooldownUntil)}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&:disabled': {
                      bgcolor: 'action.disabledBackground',
                    },
                  }}
                >
                  {cooldownSeconds > 0 ? (
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {cooldownSeconds}s
                    </Typography>
                  ) : (
                    <Send size={20} />
                  )}
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Powered by Gemini 2.0 Flash
                </Typography>
                {cooldownSeconds > 0 && (
                  <Typography variant="caption" color="warning.main" sx={{ display: 'block', fontWeight: 600 }}>
                    ⏳ Cooldown: {cooldownSeconds}s
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                  Ліміт: 2 запити/хв (безкоштовний tier)
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Fade>
  );
}
