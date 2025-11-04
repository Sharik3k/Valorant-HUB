import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Map, Person, EmojiEvents, TrendingUp } from '@mui/icons-material';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Map sx={{ fontSize: 48 }} />,
      title: 'Maps & Callouts',
      description: 'Interactive maps with professional callouts and strategies',
      path: '/maps',
    },
    {
      icon: <Person sx={{ fontSize: 48 }} />,
      title: 'Agent Guides',
      description: 'Comprehensive guides for all agents with abilities breakdown',
      path: '/agents',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 48 }} />,
      title: 'VCT Esports',
      description: 'Follow professional tournaments and top teams',
      path: '/vct',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48 }} />,
      title: 'Your Profile',
      description: 'Track your stats, progress and competitive rank',
      path: '/profile',
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 8
      }}
    >

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 10, mt: 6 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
            }}
          >
            VALORANT HUB
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 400,
              color: 'text.secondary',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Your ultimate companion for VALORANT. Master maps, perfect your agent gameplay, and climb the ranks with professional strategies.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'primary.main',
              color: 'background.default',
              fontSize: '1rem',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#e0e0e0',
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
                  bgcolor: 'background.paper',
                  border: '1px solid #282828',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: '#888',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                  }
                }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: 'text.primary', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.5
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
