import { Box, Container, Typography, Grid, Card, CardContent, Chip, Avatar, Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useState } from 'react';

export default function AgentsPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const agents = [
    { name: 'Jett', role: 'Duelist', color: '#94D5FF', image: 'https://static.wikia.nocookie.net/valorant/images/3/35/Jett_icon.png', 
      abilities: ['Cloudburst - Smoke', 'Updraft - Dash upward', 'Tailwind - Dash forward', 'Blade Storm - Throwing knives'] },
    { name: 'Phoenix', role: 'Duelist', color: '#FF8C42', image: 'https://static.wikia.nocookie.net/valorant/images/1/14/Phoenix_icon.png',
      abilities: ['Blaze - Wall of fire', 'Curveball - Flash', 'Hot Hands - Molotov', 'Run It Back - Respawn'] },
    { name: 'Reyna', role: 'Duelist', color: '#A741FF', image: 'https://static.wikia.nocookie.net/valorant/images/b/b0/Reyna_icon.png',
      abilities: ['Leer - Blind', 'Devour - Heal', 'Dismiss - Invulnerable', 'Empress - Combat boost'] },
    { name: 'Raze', role: 'Duelist', color: '#FF6B9D', image: 'https://static.wikia.nocookie.net/valorant/images/9/9c/Raze_icon.png',
      abilities: ['Boom Bot - Explosive bot', 'Blast Pack - Explosive satchel', 'Paint Shells - Cluster grenade', 'Showstopper - Rocket launcher'] },
    { name: 'Yoru', role: 'Duelist', color: '#2D4E9E', image: 'https://static.wikia.nocookie.net/valorant/images/d/d4/Yoru_icon.png',
      abilities: ['Fakeout - Decoy', 'Blindside - Flash', 'Gatecrash - Teleport', 'Dimensional Drift - Invisibility'] },
    { name: 'Neon', role: 'Duelist', color: '#0DFFFF', image: 'https://static.wikia.nocookie.net/valorant/images/d/d0/Neon_icon.png',
      abilities: ['Fast Lane - Electric walls', 'Relay Bolt - Stun', 'High Gear - Sprint & slide', 'Overdrive - Electric beam'] },
    { name: 'Iso', role: 'Duelist', color: '#9370DB', image: 'https://static.wikia.nocookie.net/valorant/images/b/b7/Iso_icon.png',
      abilities: ['Undercut - Energy bolt', 'Double Tap - Shield', 'Contingency - Wall', 'Kill Contract - 1v1 dimension'] },
    { name: 'Sage', role: 'Sentinel', color: '#5EE7B7', image: 'https://static.wikia.nocookie.net/valorant/images/7/74/Sage_icon.png',
      abilities: ['Barrier Orb - Wall', 'Slow Orb - Slow field', 'Healing Orb - Heal', 'Resurrection - Revive'] },
    { name: 'Cypher', role: 'Sentinel', color: '#FFBD66', image: 'https://static.wikia.nocookie.net/valorant/images/8/88/Cypher_icon.png',
      abilities: ['Trapwire - Trip', 'Cyber Cage - Cage', 'Spycam - Camera', 'Neural Theft - Reveal enemies'] },
    { name: 'Killjoy', role: 'Sentinel', color: '#FFD942', image: 'https://static.wikia.nocookie.net/valorant/images/1/15/Killjoy_icon.png',
      abilities: ['Nanoswarm - Grenade', 'Alarmbot - Detection bot', 'Turret - Shooting turret', 'Lockdown - Detain zone'] },
    { name: 'Chamber', role: 'Sentinel', color: '#FFD89C', image: 'https://static.wikia.nocookie.net/valorant/images/0/09/Chamber_icon.png',
      abilities: ['Trademark - Trap', 'Headhunter - Pistol', 'Rendezvous - Teleport', 'Tour De Force - Sniper'] },
    { name: 'Deadlock', role: 'Sentinel', color: '#A5B2C4', image: 'https://static.wikia.nocookie.net/valorant/images/e/eb/Deadlock_icon.png',
      abilities: ['GravNet - Trap net', 'Sonic Sensor - Sound trap', 'Barrier Mesh - Wall', 'Annihilation - Cocoon'] },
    { name: 'Vyse', role: 'Sentinel', color: '#C5A3FF', image: 'https://static.wikia.nocookie.net/valorant/images/2/21/Vyse_icon.png/',
      abilities: ['Shear - Trap', 'Arc Rose - Blind', 'Razorvine - Wall', 'Steel Garden - Thorn field'] },
    { name: 'Sova', role: 'Initiator', color: '#6E93D6', image: 'https://static.wikia.nocookie.net/valorant/images/4/49/Sova_icon.png',
      abilities: ['Owl Drone - Recon drone', 'Shock Bolt - Damage arrow', 'Recon Bolt - Reveal arrow', 'Hunter\'s Fury - Energy beams'] },
    { name: 'Breach', role: 'Initiator', color: '#FF6633', image: 'https://static.wikia.nocookie.net/valorant/images/5/53/Breach_icon.png',
      abilities: ['Aftershock - Charge', 'Flashpoint - Flash', 'Fault Line - Stun', 'Rolling Thunder - Earthquake'] },
    { name: 'Skye', role: 'Initiator', color: '#8DD3C7', image: 'https://static.wikia.nocookie.net/valorant/images/3/33/Skye_icon.png',
      abilities: ['Regrowth - Heal', 'Trailblazer - Tasmanian tiger', 'Guiding Light - Flash', 'Seekers - Track enemies'] },
    { name: 'KAY/O', role: 'Initiator', color: '#5D6D7E', image: 'https://static.wikia.nocookie.net/valorant/images/f/f0/KAYO_icon.png/',
      abilities: ['FRAG/ment - Grenade', 'FLASH/drive - Flash', 'ZERO/point - Suppress', 'NULL/cmd - Overload'] },
    { name: 'Fade', role: 'Initiator', color: '#2C3E50', image: 'https://static.wikia.nocookie.net/valorant/images/a/a6/Fade_icon.png',
      abilities: ['Prowler - Tracking creature', 'Seize - Tether', 'Haunt - Reveal', 'Nightfall - Terror zone'] },
    { name: 'Gekko', role: 'Initiator', color: '#7FFF00', image: 'https://static.wikia.nocookie.net/valorant/images/6/66/Gekko_icon.png',
      abilities: ['Mosh Pit - Molotov', 'Wingman - Plant/defuse buddy', 'Dizzy - Blind', 'Thrash - Detain'] },
    { name: 'Tejo', role: 'Initiator', color: '#FF8B3D', image: 'https://static.wikia.nocookie.net/valorant/images/9/90/Tejo_icon.png/',
      abilities: ['Steady - Aim stabilizer', 'Arco - Bounce grenade', 'Quebrada - Wall destruction', 'Catapulta - Launch allies'] },
    { name: 'Brimstone', role: 'Controller', color: '#FF6B35', image: 'https://static.wikia.nocookie.net/valorant/images/4/4d/Brimstone_icon.png/',
      abilities: ['Stim Beacon - Combat buff', 'Incendiary - Molotov', 'Sky Smoke - Smoke', 'Orbital Strike - Laser strike'] },
    { name: 'Viper', role: 'Controller', color: '#1DB954', image: 'https://static.wikia.nocookie.net/valorant/images/5/5f/Viper_icon.png',
      abilities: ['Snake Bite - Acid pool', 'Poison Cloud - Gas orb', 'Toxic Screen - Gas wall', 'Viper\'s Pit - Toxic zone'] },
    { name: 'Omen', role: 'Controller', color: '#7F5EFF', image: 'https://static.wikia.nocookie.net/valorant/images/b/b0/Omen_icon.png',
      abilities: ['Shrouded Step - Teleport', 'Paranoia - Blind', 'Dark Cover - Smoke', 'From the Shadows - Teleport anywhere'] },
    { name: 'Astra', role: 'Controller', color: '#9D5FFF', image: 'https://static.wikia.nocookie.net/valorant/images/0/08/Astra_icon.png',
      abilities: ['Nova Pulse - Stun', 'Nebula - Smoke', 'Gravity Well - Pull', 'Cosmic Divide - Block bullets'] },
    { name: 'Harbor', role: 'Controller', color: '#4DD4FF', image: 'https://static.wikia.nocookie.net/valorant/images/f/f3/Harbor_icon.png',
      abilities: ['Cascade - Wave wall', 'Cove - Sphere shield', 'High Tide - Long wall', 'Reckoning - Geyser strikes'] },
    { name: 'Clove', role: 'Controller', color: '#FF69B4', image: 'https://static.wikia.nocookie.net/valorant/images/3/30/Clove_icon.png',
      abilities: ['Pick-me-up - Heal', 'Meddle - Decay', 'Ruse - Smoke', 'Not Dead Yet - Self-revive'] },
  ];

  const roleColors = {
    Duelist: '#ff4655',
    Sentinel: '#4da6ff',
    Initiator: '#7fff00',
    Controller: '#9d5fff'
  };

  const roles = ['All', 'Duelist', 'Controller', 'Initiator', 'Sentinel'];
  const filteredAgents = selectedRole === 'All' 
    ? agents 
    : agents.filter(agent => agent.role === selectedRole);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1923 0%, #1a2332 50%, #0f1923 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ArrowBack 
            sx={{ fontSize: 30, color: '#ff4655', cursor: 'pointer', mr: 2 }} 
            onClick={() => navigate('/')}
          />
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff' }}>
            Agent Guides
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
          Master every agent with comprehensive guides, ability breakdowns, and pro tips.
        </Typography>

        {/* Filter Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {roles.map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? 'contained' : 'outlined'}
              onClick={() => setSelectedRole(role)}
              sx={{
                background: selectedRole === role 
                  ? role === 'All' 
                    ? 'linear-gradient(45deg, #ff4655, #764ba2)'
                    : `linear-gradient(45deg, ${roleColors[role as keyof typeof roleColors]}, ${roleColors[role as keyof typeof roleColors]}aa)`
                  : 'transparent',
                color: selectedRole === role ? '#fff' : 'rgba(255,255,255,0.7)',
                border: selectedRole === role ? 'none' : '1px solid rgba(255,255,255,0.3)',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.875rem',
                '&:hover': {
                  background: role === 'All'
                    ? 'linear-gradient(45deg, #ff4655, #764ba2)'
                    : `linear-gradient(45deg, ${roleColors[role as keyof typeof roleColors]}, ${roleColors[role as keyof typeof roleColors]}aa)`,
                  color: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(255,70,85,0.4)'
                }
              }}
            >
              {role}
            </Button>
          ))}
        </Box>

        <Grid container spacing={3}>
          {filteredAgents.map((agent, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: agent.color }}>
                      Abilities:
                    </Typography>
                    {agent.abilities.map((ability, i) => (
                      <Typography key={i} variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                        • {ability}
                      </Typography>
                    ))}
                  </Box>
                }
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(26, 31, 46, 0.98)',
                      border: `2px solid ${agent.color}`,
                      borderRadius: 2,
                      boxShadow: `0 8px 24px ${agent.color}66`,
                      maxWidth: 300,
                      '& .MuiTooltip-arrow': {
                        color: agent.color,
                      }
                    }
                  }
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${agent.color}22 0%, rgba(26, 31, 46, 0.8) 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${agent.color}44`,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: `2px solid ${agent.color}`,
                      boxShadow: `0 15px 30px ${agent.color}66`
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      src={agent.image}
                      alt={agent.name}
                      sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        border: `4px solid ${agent.color}`,
                        boxShadow: `0 0 20px ${agent.color}66`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: `0 0 30px ${agent.color}`
                        }
                      }}
                      imgProps={{
                        onError: (e: any) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/100/${agent.color.slice(1)}/ffffff?text=${agent.name.charAt(0)}`;
                        }
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                      {agent.name}
                    </Typography>
                    <Chip 
                      label={agent.role}
                      size="small"
                      sx={{ 
                        background: roleColors[agent.role as keyof typeof roleColors],
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
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
