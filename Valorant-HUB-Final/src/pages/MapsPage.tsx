import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Tooltip, Modal, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Close, LocationOn, Info } from '@mui/icons-material';
import { useState } from 'react';

export default function MapsPage() {
  const navigate = useNavigate();
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMapClick = (map: any) => {
    setSelectedMap(map);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMap(null);
  };

  const maps = [
    {
      name: 'Ascent',
      location: 'Ascent, (Venice, Italy)',
      sites: ['A', 'B'],
      description: 'An open playground for small wars of position and attrition',
      detailedDescription: 'Ascent is a map set in Venice, Italy. It features wide open spaces and multiple angles, making it perfect for tactical gameplay. The map has two bomb sites connected by a central area called Mid.',
      image: 'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/0/04/Ascent_minimap.png',
      callouts: ['A Main', 'A Heaven', 'A Hell', 'B Main', 'B Site', 'Mid Market', 'Mid Catwalk', 'Mid Bottom'],
      tips: [
        'Control Mid Market for rotations',
        'Use Catwalk for flanking opportunities',
        'A Heaven provides excellent angles for defenders',
        'Watch for pushes through A Main and B Main'
      ],
      bestAgents: ['Sova', 'Omen', 'Jett', 'Killjoy']
    },
    {
      name: 'Bind',
      location: 'Bind, (Rabat, Morocco)',
      sites: ['A', 'B'],
      description: 'Two sites. No middle. Gotta pick left or right',
      detailedDescription: 'Bind is unique for having no traditional middle area. Instead, it features teleporters that connect different parts of the map, creating unique rotation opportunities.',
      image: 'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/e/e6/Bind_minimap.png',
      callouts: ['A Short', 'A Long', 'A Bath', 'A Showers', 'B Long', 'B Short', 'Hookah', 'Teleporter'],
      tips: [
        'Master teleporter timings for rotations',
        'Control Hookah for B site access',
        'Use Showers for A site flanks',
        'Watch both teleporter exits when defending'
      ],
      bestAgents: ['Raze', 'Brimstone', 'Sage', 'Cypher']
    },
    {
      name: 'Haven',
      location: 'Haven, (Thimphu, Bhutan)',
      sites: ['A', 'B', 'C'],
      description: 'A playable experiment with three sites',
      detailedDescription: 'Haven is the only map with three bomb sites, making it unique in VALORANT. This creates complex strategic decisions for both attackers and defenders.',
      image: 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/2/25/Haven_minimap.png',
      callouts: ['A Long', 'A Short', 'A Site', 'B Site', 'C Long', 'C Site', 'Garage', 'Mid Window'],
      tips: [
        'Coordinate team splits across three sites',
        'Use Garage for rotations between A and C',
        'Mid Window provides crucial map control',
        'Stack sites based on enemy tendencies'
      ],
      bestAgents: ['Sova', 'Omen', 'Breach', 'Cypher']
    },
    {
      name: 'Split',
      location: 'Split, (Tokyo, Japan)',
      sites: ['A', 'B'],
      description: 'Divided by an elevated center, each side fights for control',
      detailedDescription: 'Split features a unique vertical design with elevated positions and tight chokepoints. The map rewards precise aim and coordinated team plays.',
      image: 'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/f/ff/Split_minimap.png',
      callouts: ['A Main', 'A Ramps', 'A Heaven', 'B Main', 'B Site', 'Mid Mail', 'Mid Vents', 'Sewers'],
      tips: [
        'Control Mid for map dominance',
        'Use Ramps for A site executes',
        'Sewers provide flanking routes',
        'Heaven positions are crucial for defense'
      ],
      bestAgents: ['Raze', 'Sage', 'Cypher', 'Omen']
    },
    {
      name: 'Icebox',
      location: 'Icebox, (Bennett Island, Russia)',
      sites: ['A', 'B'],
      description: 'Your next battleground is a secret Kingdom excavation site',
      detailedDescription: 'Icebox is a vertical map with multiple levels and long sightlines. It requires good coordination and utility usage to succeed.',
      image: 'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/c/cf/Icebox_minimap.png',
      callouts: ['A Belt', 'A Pipes', 'A Nest', 'B Site', 'B Yellow', 'Mid Tube', 'Kitchen', 'Boiler'],
      tips: [
        'Use vertical angles to your advantage',
        'Control Tube for rotations',
        'Nest provides strong defensive positions',
        'Kitchen area is crucial for B site control'
      ],
      bestAgents: ['Sage', 'Viper', 'Jett', 'Killjoy']
    },
    {
      name: 'Breeze',
      location: 'Breeze, (Bermuda Triangle)',
      sites: ['A', 'B'],
      description: 'Take in the sights on this open coastal map',
      detailedDescription: 'Breeze features long sightlines and open areas, favoring long-range engagements and precise aim. Map control is essential.',
      image: 'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/7/78/Breeze_minimap.png',
      callouts: ['A Main', 'A Cave', 'A Site', 'B Main', 'B Elbow', 'Mid Hall', 'Mid Nest', 'Tunnel'],
      tips: [
        'Long-range weapons are favored',
        'Use smokes to block sightlines',
        'Cave provides alternative A site access',
        'Mid control is crucial for rotations'
      ],
      bestAgents: ['Viper', 'Sova', 'Jett', 'Chamber']
    },
    {
      name: 'Fracture',
      location: 'Fracture, (New Mexico, USA)',
      sites: ['A', 'B'],
      description: 'A top secret research facility split apart by a failed experiment',
      detailedDescription: 'Fracture has a unique H-shaped layout where defenders spawn in the middle and attackers can approach from both sides.',
      image: 'https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/1/18/Fracture_minimap.png',
      callouts: ['A Main', 'A Rope', 'A Site', 'B Main', 'B Arcade', 'B Site', 'Mid Canteen', 'Zipline'],
      tips: [
        'Coordinate pincer attacks from both sides',
        'Use ziplines for quick rotations',
        'Rope provides alternative A site access',
        'Arcade control is key for B site'
      ],
      bestAgents: ['Breach', 'Brimstone', 'Neon', 'Killjoy']
    },
    {
      name: 'Pearl',
      location: 'Pearl, (Lisbon, Portugal)',
      sites: ['A', 'B'],
      description: 'Attackers will send noise and signals through the paths',
      detailedDescription: 'Pearl is an underwater city with clean sightlines and multiple rotation paths. It rewards tactical gameplay and team coordination.',
      image: 'https://static.wikia.nocookie.net/valorant/images/a/af/Loading_Screen_Pearl.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/6/63/Pearl_minimap.png',
      callouts: ['A Main', 'A Art', 'A Site', 'B Main', 'B Ramp', 'Mid Plaza', 'Mid Connector', 'Mid Link'],
      tips: [
        'Control Mid Plaza for rotations',
        'Art provides strong A site angles',
        'Use Connector for flanking',
        'B Ramp is a key chokepoint'
      ],
      bestAgents: ['Viper', 'Sova', 'Jett', 'Chamber']
    },
    {
      name: 'Lotus',
      location: 'Lotus, (Western Ghats, India)',
      sites: ['A', 'B', 'C'],
      description: 'A mysterious structure housing an astral conduit',
      detailedDescription: 'Lotus brings back the three-site format with rotating doors and unique mechanical elements that add strategic depth.',
      image: 'https://static.wikia.nocookie.net/valorant/images/d/d0/Loading_Screen_Lotus.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/b/be/Lotus_minimap.png',
      callouts: ['A Main', 'A Rubble', 'A Site', 'B Main', 'B Site', 'C Main', 'C Site', 'Mid Top'],
      tips: [
        'Coordinate team splits across three sites',
        'Use rotating doors strategically',
        'Control Mid Top for rotations'
      ],
      bestAgents: ['Sova', 'Omen', 'Breach', 'Cypher']
    },
    {
      name: 'Sunset',
      location: 'Sunset, (Los Angeles, USA)',
      sites: ['A', 'B'],
      description: 'A gleaming city full of colorful murals',
      detailedDescription: 'Sunset features vibrant street art and urban environments with multiple elevation changes and creative angles.',
      image: 'https://static.wikia.nocookie.net/valorant/images/5/5c/Loading_Screen_Sunset.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/7/7b/Sunset_minimap.png',
      callouts: ['A Main', 'A Elbow', 'A Site', 'B Main', 'B Market', 'Mid Top', 'Mid Courtyard', 'Mid Link'],
      tips: [
        'Use elevation changes to your advantage',
        'Control Mid for rotations',
        'Market area is key for B site'
      ],
      bestAgents: ['Jett', 'Omen', 'Killjoy', 'Breach']
    },
    {
      name: 'Abyss',
      location: 'Abyss, (Sør-Jan, Jan Mayen, Norway)',
      sites: ['A', 'B'],
      description: 'A mysterious map with no boundaries',
      detailedDescription: 'Abyss is a unique map with no fall barriers, requiring careful positioning and movement to avoid deadly drops.',
      image: 'https://static.wikia.nocookie.net/valorant/images/6/61/Loading_Screen_Abyss.png',
      minimap: 'https://static.wikia.nocookie.net/valorant/images/5/5f/Abyss_minimap.png',
      callouts: ['A Main', 'A Site', 'B Main', 'B Site', 'Mid Bridge', 'Mid Plaza', 'Mid Lane', 'Tunnel'],
      tips: [
        'Be careful of fall damage',
        'Use Bridge for rotations',
        'Control Plaza for map dominance'
      ],
      bestAgents: ['Omen', 'Jett', 'Chamber', 'Killjoy']
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
                placement="bottom"
                arrow
                PopperProps={{
                  sx: {
                    zIndex: 9999,
                  }
                }}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(26, 31, 46, 0.98)',
                      border: '2px solid #ff4655',
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(255, 70, 85, 0.6)',
                      maxWidth: 350,
                      position: 'relative',
                      zIndex: 9999,
                      '& .MuiTooltip-arrow': {
                        color: '#ff4655',
                      }
                    }
                  }
                }}
              >
                <Card
                  onClick={() => handleMapClick(map)}
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

      {/* Modal Window */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)',
            borderRadius: 3,
            border: '2px solid #ff4655',
            boxShadow: '0 20px 40px rgba(255, 70, 85, 0.4)',
            position: 'relative'
          }}
        >
          {selectedMap && (
            <>
              {/* Header */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={selectedMap.image}
                  alt={selectedMap.name}
                  sx={{
                    height: 250,
                    objectFit: 'cover',
                    borderRadius: '12px 12px 0 0'
                  }}
                />
                <IconButton
                  onClick={handleCloseModal}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#ff4655',
                    '&:hover': {
                      background: 'rgba(255, 70, 85, 0.2)'
                    }
                  }}
                >
                  <Close />
                </IconButton>
              </Box>

              {/* Content */}
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: '#ff4655', mr: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
                    {selectedMap.location}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                  {selectedMap.detailedDescription || selectedMap.description}
                </Typography>

                <Divider sx={{ borderColor: 'rgba(255, 70, 85, 0.3)', mb: 3 }} />

                {/* Sites */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#ff4655', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ mr: 1 }} />
                    Bomb Sites
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedMap.sites.map((site: string, i: number) => (
                      <Chip
                        key={i}
                        label={`Site ${site}`}
                        sx={{
                          background: 'linear-gradient(45deg, #ff4655, #ff6b75)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '1rem',
                          height: 40
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Callouts */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#ff4655', mb: 2 }}>
                    Key Callouts
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedMap.callouts.map((callout: string, i: number) => (
                      <Chip
                        key={i}
                        label={callout}
                        size="medium"
                        sx={{
                          background: 'rgba(255, 70, 85, 0.2)',
                          color: '#fff',
                          border: '1px solid rgba(255, 70, 85, 0.4)',
                          '&:hover': {
                            background: 'rgba(255, 70, 85, 0.3)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Tips */}
                {selectedMap.tips && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#ff4655', mb: 2 }}>
                      Pro Tips
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {selectedMap.tips.map((tip: string, i: number) => (
                        <Typography
                          key={i}
                          variant="body2"
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            mb: 1,
                            '&:before': {
                              content: '"•"',
                              color: '#ff4655',
                              fontWeight: 'bold',
                              marginRight: '8px'
                            }
                          }}
                        >
                          {tip}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Best Agents */}
                {selectedMap.bestAgents && (
                  <Box>
                    <Typography variant="h6" sx={{ color: '#ff4655', mb: 2 }}>
                      Recommended Agents
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedMap.bestAgents.map((agent: string, i: number) => (
                        <Chip
                          key={i}
                          label={agent}
                          sx={{
                            background: 'linear-gradient(45deg, #53e3ff, #4fc3f7)',
                            color: '#000',
                            fontWeight: 600
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
