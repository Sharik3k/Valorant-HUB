import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

export default function MapsPage() {
  const navigate = useNavigate();

  const maps = [
    {
      name: 'Ascent',
      location: 'Ascent, (Venice, Italy)',
      sites: ['A', 'B'],
      description: 'An open playground for small wars of position and attrition',
      image: 'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/0/04/Ascent_minimap.png',
      callouts: ['A Main', 'A Heaven', 'A Hell', 'B Main', 'B Site', 'Mid Market', 'Mid Catwalk', 'Mid Bottom']
    },
    {
      name: 'Bind',
      location: 'Bind, (Rabat, Morocco)',
      sites: ['A', 'B'],
      description: 'Two sites. No middle. Gotta pick left or right',
      image: 'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/e/e6/Bind_minimap.png',
      callouts: ['A Short', 'A Long', 'A Bath', 'A Showers', 'B Long', 'B Short', 'Hookah', 'Teleporter']
    },
    {
      name: 'Haven',
      location: 'Haven, (Thimphu, Bhutan)',
      sites: ['A', 'B', 'C'],
      description: 'A playable experiment with three sites',
      image: 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/2/25/Haven_minimap.png',
      callouts: ['A Long', 'A Short', 'A Site', 'B Site', 'C Long', 'C Site', 'Garage', 'Mid Window']
    },
    {
      name: 'Split',
      location: 'Split, (Tokyo, Japan)',
      sites: ['A', 'B'],
      description: 'Divided by an elevated center, each side fights for control',
      image: 'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/f/ff/Split_minimap.png',
      callouts: ['A Main', 'A Ramps', 'A Heaven', 'B Main', 'B Site', 'Mid Mail', 'Mid Vents', 'Sewers']
    },
    {
      name: 'Icebox',
      location: 'Icebox, (Bennett Island, Russia)',
      sites: ['A', 'B'],
      description: 'Your next battleground is a secret Kingdom excavation site',
      image: 'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/c/cf/Icebox_minimap.png',
      callouts: ['A Belt', 'A Pipes', 'A Nest', 'B Site', 'B Yellow', 'Mid Tube', 'Kitchen', 'Boiler']
    },
    {
      name: 'Breeze',
      location: 'Breeze, (Bermuda Triangle)',
      sites: ['A', 'B'],
      description: 'Take in the sights on this open coastal map',
      image: 'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/7/78/Breeze_minimap.png',
      callouts: ['A Main', 'A Cave', 'A Site', 'B Main', 'B Elbow', 'Mid Hall', 'Mid Nest', 'Tunnel']
    },
    {
      name: 'Fracture',
      location: 'Fracture, (New Mexico, USA)',
      sites: ['A', 'B'],
      description: 'A top secret research facility split apart by a failed experiment',
      image: 'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/1/18/Fracture_minimap.png',
      callouts: ['A Main', 'A Rope', 'A Site', 'B Main', 'B Arcade', 'B Site', 'Mid Canteen', 'Zipline']
    },
    {
      name: 'Pearl',
      location: 'Pearl, (Lisbon, Portugal)',
      sites: ['A', 'B'],
      description: 'Attackers will send noise and signals through the paths',
      image: 'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/6/63/Pearl_minimap.png',
      callouts: ['A Main', 'A Art', 'A Site', 'B Main', 'B Ramp', 'Mid Plaza', 'Mid Connector', 'Mid Link']
    },
    {
      name: 'Lotus',
      location: 'Lotus, (Western Ghats, India)',
      sites: ['A', 'B', 'C'],
      description: 'A mysterious structure housing an astral conduit',
      image: 'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/b/be/Lotus_minimap.png',
      callouts: ['A Main', 'A Rubble', 'A Site', 'B Main', 'B Site', 'C Main', 'C Site', 'Mid Top']
    },
    {
      name: 'Sunset',
      location: 'Sunset, (Los Angeles, USA)',
      sites: ['A', 'B'],
      description: 'A gleaming city full of colorful murals',
      image: 'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/7/7b/Sunset_minimap.png',
      callouts: ['A Main', 'A Elbow', 'A Site', 'B Main', 'B Market', 'Mid Top', 'Mid Courtyard', 'Mid Link']
    },
    {
      name: 'Abyss',
      location: 'Abyss, (Sør-Jan, Jan Mayen, Norway)',
      sites: ['A', 'B'],
      description: 'A mysterious map with no boundaries',
      image: 'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/5/5f/Abyss_minimap.png',
      callouts: ['A Main', 'A Site', 'B Main', 'B Site', 'Mid Bridge', 'Mid Plaza', 'Mid Lane', 'Tunnel']
    },
    {
      name: 'Corrode',
      location: 'Corrode, (Kerala, India)',
      sites: ['A', 'B'],
      description: 'A corrupted battlefield with dynamic terrain',
      image: 'https://static.wikia.nocookie.net/valorant/images/6/6f/Loading_Screen_Corrode.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/4/46/Corrode_minimap.png',
      callouts: ['A Main', 'A Site', 'A Heaven', 'B Main', 'B Site', 'Mid Control', 'Mid Link', 'Connector']
    }
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
            Maps & Callouts
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
          Master every corner, angle, and callout on all VALORANT maps. Click on a map to explore detailed strategies.
        </Typography>

        <Grid container spacing={3}>
          {maps.map((map, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#ff4655' }}>
                      {map.name} - Callouts
                    </Typography>
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img 
                        src={map.minimap} 
                        alt={`${map.name} minimap`}
                        style={{ 
                          width: '200px', 
                          height: '200px', 
                          objectFit: 'contain',
                          borderRadius: '8px',
                          border: '2px solid #ff4655'
                        }}
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Key Positions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {map.callouts.map((callout, i) => (
                        <Chip
                          key={i}
                          label={callout}
                          size="small"
                          sx={{
                            background: 'rgba(255, 70, 85, 0.2)',
                            color: '#fff',
                            fontSize: '0.7rem',
                            height: '20px'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                }
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(26, 31, 46, 0.98)',
                      border: '2px solid #ff4655',
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(255, 70, 85, 0.6)',
                      maxWidth: 350,
                      '& .MuiTooltip-arrow': {
                        color: '#ff4655',
                      }
                    }
                  }
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(26, 31, 46, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: '1px solid rgba(255, 70, 85, 0.5)',
                      boxShadow: '0 15px 30px rgba(255, 70, 85, 0.3)'
                    }
                  }}
                >
                <CardMedia
                  component="img"
                  image={map.image}
                  alt={map.name}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    filter: 'brightness(0.9) contrast(1.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: 'brightness(1.1) contrast(1.2)',
                      transform: 'scale(1.05)'
                    }
                  }}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200/1a1f2e/ff4655?text=' + map.name;
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#ffffff' }}>
                    {map.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                    {map.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {map.sites.map((site, i) => (
                      <Chip 
                        key={i}
                        label={`Site ${site}`}
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(45deg, #ff4655, #ff6b75)',
                          color: '#fff',
                          fontWeight: 600
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
