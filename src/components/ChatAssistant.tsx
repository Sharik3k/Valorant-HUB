import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { Box, IconButton, TextField, Typography, Paper, Fade, Tooltip } from '@mui/material';
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
  const [threadId, setThreadId] = useState<string | null>(null); // Стан для ID розмови
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.sendMessage(trimmedInput, threadId);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setThreadId(response.threadId); // Зберігаємо ID розмови

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка при отриманні відповіді';
      setError(errorMessage);
      console.error('Chat error:', err);

      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorChatMessage]);
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

  const handleClearHistory = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: '👋 Привіт! Я AI асистент VALORANT HUB. Можу допомогти з питаннями про агентів, мапи, зброю та стратегії. Як можу допомогти?',
      timestamp: new Date(),
    }]);
    setThreadId(null); // Скидаємо розмову
    setError(null);
  };

  if (!isOpen) {
    return (
      <Tooltip title="AI Асистент" placement="left">
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: '0 4px 20px rgba(255, 70, 85, 0.4)',
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: '0 6px 30px rgba(255, 70, 85, 0.6)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
          }}
        >
          <MessageCircle size={28} />
        </IconButton>
      </Tooltip>
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
            <Tooltip title="Очистити історію" placement="bottom">
              <IconButton
                size="small"
                onClick={handleClearHistory}
                sx={{ color: 'white' }}
                disabled={messages.length <= 1}
              >
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
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
                  disabled={!inputValue.trim() || isLoading}
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
                  <Send size={20} />
                </IconButton>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1, textAlign: 'center' }}
              >
                Powered by {aiService.getModel()}
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Fade>
  );
}
