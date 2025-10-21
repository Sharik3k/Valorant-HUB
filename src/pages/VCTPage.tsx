import { Box, Container, Typography, Grid, Card, CardContent, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, EmojiEvents } from '@mui/icons-material';

export default function VCTPage() {
  const navigate = useNavigate();

  const topTeams = [
    { rank: 1, name: 'Paper Rex', region: 'Pacific', points: 2450, logo: '🦖' },
    { rank: 2, name: 'Fnatic', region: 'EMEA', points: 2380, logo: '🍊' },
    { rank: 3, name: 'Evil Geniuses', region: 'Americas', points: 2310, logo: '😈' },
    { rank: 4, name: 'LOUD', region: 'Americas', points: 2250, logo: '🔊' },
    { rank: 5, name: 'DRX', region: 'Pacific', points: 2180, logo: '🐉' },
    { rank: 6, name: 'Team Liquid', region: 'EMEA', points: 2100, logo: '🐴' },
    { rank: 7, name: 'NRG', region: 'Americas', points: 2050, logo: '⚡' },
    { rank: 8, name: 'NAVI', region: 'EMEA', points: 2000, logo: '🌟' }
  ];

  const upcomingMatches = [
    { team1: 'Paper Rex', team2: 'Fnatic', time: 'Today, 18:00', tournament: 'VCT Masters' },
    { team1: 'LOUD', team2: 'Evil Geniuses', time: 'Tomorrow, 20:00', tournament: 'VCT Masters' },
    { team1: 'DRX', team2: 'Team Liquid', time: 'Tomorrow, 22:00', tournament: 'VCT Champions' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1923 0%, #1a2332 50%, #0f1923 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ArrowBack 
            sx={{ fontSize: 30, color: '#ff4655', cursor: 'pointer', mr: 2 }} 
            onClick={() => navigate('/')}
          />
          <EmojiEvents sx={{ fontSize: 40, color: '#ffd700', mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff' }}>
            VCT Esports
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
          Follow the best VALORANT teams and tournaments from around the world.
        </Typography>

        {/* Top Teams */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', mb: 3 }}>
            World Rankings
          </Typography>
          <Grid container spacing={2}>
            {topTeams.map((team) => (
              <Grid item xs={12} sm={6} md={3} key={team.rank}>
                <Card
                  sx={{
                    background: team.rank <= 3 
                      ? `linear-gradient(135deg, ${team.rank === 1 ? '#FFD700' : team.rank === 2 ? '#C0C0C0' : '#CD7F32'}22, rgba(26, 31, 46, 0.8))`
                      : 'rgba(26, 31, 46, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: team.rank <= 3 
                      ? `2px solid ${team.rank === 1 ? '#FFD700' : team.rank === 2 ? '#C0C0C0' : '#CD7F32'}`
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(255, 70, 85, 0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#ff4655', mb: 1 }}>
                      #{team.rank}
                    </Typography>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        background: 'linear-gradient(135deg, #ff4655, #764ba2)',
                        fontSize: '2rem'
                      }}
                    >
                      {team.logo}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                      {team.name}
                    </Typography>
                    <Chip 
                      label={team.region}
                      size="small"
                      sx={{ mb: 1, background: 'rgba(255, 70, 85, 0.2)', color: '#ff4655' }}
                    />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {team.points} pts
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Upcoming Matches */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff', mb: 3 }}>
            Upcoming Matches
          </Typography>
          <Grid container spacing={2}>
            {upcomingMatches.map((match, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    background: 'rgba(26, 31, 46, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1px solid rgba(255, 70, 85, 0.5)',
                      boxShadow: '0 8px 16px rgba(255, 70, 85, 0.3)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                          {match.team1}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#ff4655', fontWeight: 900 }}>
                          VS
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                          {match.team2}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip 
                          label={match.tournament}
                          size="small"
                          sx={{ mb: 1, background: 'linear-gradient(45deg, #667eea, #764ba2)', color: '#fff' }}
                        />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {match.time}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
