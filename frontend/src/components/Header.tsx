import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const navItems = [
  { label: 'Maps', path: '/maps' },
  { label: 'Agents', path: '/agents' },
  { label: 'VCT', path: '/vct' },
  { label: 'Profile', path: '/profile' },
];

export default function Header() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid #282828',
        boxShadow: 'none'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            color: 'text.primary', 
            textDecoration: 'none', 
            fontWeight: 600 
          }}
        >
          VALORANT HUB
        </Typography>
        <Box>
          {navItems.map((item) => (
            <Button 
              key={item.label} 
              component={RouterLink} 
              to={item.path} 
              sx={{ 
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: '6px',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
