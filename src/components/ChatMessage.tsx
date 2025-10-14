// Chat Message Component
import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          maxWidth: '70%',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 36,
            height: 36,
          }}
        >
          {isUser ? <Person /> : <SmartToy />}
        </Avatar>

        <Paper
          elevation={2}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.dark' : 'background.paper',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </Typography>
          
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              mt: 1,
              display: 'block',
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;
