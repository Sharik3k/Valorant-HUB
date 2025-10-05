import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import MapsPage from './pages/MapsPage';
import AgentsPage from './pages/AgentsPage';
import VCTPage from './pages/VCTPage';
import ProfilePage from './pages/ProfilePage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4655',
    },
    secondary: {
      main: '#53e3ff',
    },
    background: {
      default: '#0a0e13',
      paper: '#1a1f2e',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 900,
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/vct" element={<VCTPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
