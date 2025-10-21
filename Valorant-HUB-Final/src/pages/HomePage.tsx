import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Map, Person, EmojiEvents, TrendingUp, SmartToy } from '@mui/icons-material';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Map sx={{ fontSize: 60 }} />,
      title: 'Maps & Callouts',
      description: 'Interactive maps with professional callouts and strategies',
      path: '/maps',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Person sx={{ fontSize: 60 }} />,
      title: 'Agent Guides',
      description: 'Comprehensive guides for all agents with abilities breakdown',
      path: '/agents',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 60 }} />,
      title: 'VCT Esports',
      description: 'Follow professional tournaments and top teams',
      path: '/vct',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 60 }} />,
      title: 'Your Profile',
      description: 'Track your stats, progress and competitive rank',
      path: '/profile',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: <SmartToy sx={{ fontSize: 60 }} />,
      title: 'AI Chat Assistant',
      description: 'Get instant help with AI-powered chat using OpenRouter',
      path: '/ai-chat',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1923 0%, #1a2332 50%, #0f1923 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at 20% 50%, #ff4655 0%, transparent 50%), radial-gradient(circle at 80% 80%, #53e3ff 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.1 },
            '50%': { opacity: 0.2 }
          }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ff4655, #53e3ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            VALORANT HUB
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#ffffff',
              mb: 3,
              textShadow: '0 0 20px rgba(255, 70, 85, 0.5)'
            }}
          >
            DOMINATE EVERY ROUND
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              mx: 'auto',
              mb: 4
            }}
          >
            Your ultimate companion for VALORANT. Master maps, perfect your agent gameplay, and climb the ranks with professional strategies.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #ff4655, #ff6b75)',
              fontSize: '1.125rem',
              px: 6,
              py: 2,
              borderRadius: 2,
              textTransform: 'uppercase',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(45deg, #ff6b75, #ff4655)',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease'
              }
            }}
            onClick={() => navigate('/maps')}
          >
            Get Started
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(26, 31, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    border: '1px solid rgba(255, 70, 85, 0.5)',
                    boxShadow: '0 20px 40px rgba(255, 70, 85, 0.3)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: feature.gradient
                  }
                }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      background: feature.gradient,
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: '#ffffff'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
