import { Box, Container, Typography, Grid, Card, CardContent, Avatar, LinearProgress, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, TrendingUp, EmojiEvents, Star } from '@mui/icons-material';

export default function ProfilePage() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Wins', value: 245, icon: <EmojiEvents /> },
    { label: 'K/D Ratio', value: '1.45', icon: <TrendingUp /> },
    { label: 'Headshot %', value: '24.5%', icon: <Star /> },
    { label: 'Win Rate', value: '54%', icon: <TrendingUp /> }
  ];

  const recentMatches = [
    { map: 'Ascent', result: 'Victory', score: '13-9', kda: '24/16/8', agent: 'Jett' },
    { map: 'Bind', result: 'Defeat', score: '10-13', kda: '18/19/6', agent: 'Sage' },
    { map: 'Haven', result: 'Victory', score: '13-7', kda: '26/14/12', agent: 'Reyna' },
    { map: 'Split', result: 'Victory', score: '13-11', kda: '22/20/9', agent: 'Jett' },
    { map: 'Icebox', result: 'Defeat', score: '11-13', kda: '19/18/7', agent: 'Cypher' }
  ];

  const topAgents = [
    { name: 'Jett', games: 127, winRate: 58, kda: 1.52 },
    { name: 'Reyna', games: 89, winRate: 55, kda: 1.48 },
    { name: 'Sage', games: 76, winRate: 52, kda: 1.35 }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1923 0%, #1a2332 50%, #0f1923 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ArrowBack 
            sx={{ fontSize: 30, color: '#ff4655', cursor: 'pointer', mr: 2 }} 
            onClick={() => navigate('/')}
          />
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff' }}>
            Your Profile
          </Typography>
        </Box>

        {/* Profile Header */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(255, 70, 85, 0.2), rgba(26, 31, 46, 0.8))',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 70, 85, 0.3)',
            borderRadius: 3,
            mb: 4,
            p: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                background: 'linear-gradient(135deg, #ff4655, #764ba2)',
                fontSize: '3rem',
                border: '4px solid #ff4655'
              }}
            >
              👤
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
                Player#TAG
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  label="Immortal 2"
                  sx={{ background: 'linear-gradient(45deg, #ff4655, #764ba2)', color: '#fff', fontWeight: 700 }}
                />
                <Chip 
                  label="Level 245"
                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Progress to Immortal 3
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ff4655', fontWeight: 700 }}>
                    72/100 RR
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={72} 
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #ff4655, #764ba2)',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '1px solid rgba(255, 70, 85, 0.5)',
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ color: '#ff4655', mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Matches */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              Recent Matches
            </Typography>
            {recentMatches.map((match, index) => (
              <Card
                key={index}
                sx={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  mb: 2,
                  '&:hover': {
                    border: `1px solid ${match.result === 'Victory' ? '#4ade80' : '#ff4655'}`,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                        {match.map}
                      </Typography>
                      <Chip 
                        label={match.result}
                        size="small"
                        sx={{ 
                          background: match.result === 'Victory' ? '#4ade8044' : '#ff465544',
                          color: match.result === 'Victory' ? '#4ade80' : '#ff4655',
                          fontWeight: 600,
                          border: `1px solid ${match.result === 'Victory' ? '#4ade80' : '#ff4655'}`
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 700 }}>
                        {match.score}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {match.kda} • {match.agent}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Top Agents */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              Top Agents
            </Typography>
            {topAgents.map((agent, index) => (
              <Card
                key={index}
                sx={{
                  background: 'rgba(26, 31, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  mb: 2
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 1 }}>
                    {agent.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                    {agent.games} games • {agent.winRate}% WR
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      K/D:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4ade80', fontWeight: 700 }}>
                      {agent.kda}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
