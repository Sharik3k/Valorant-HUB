import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import MapsPage from './pages/MapsPage';
import AgentsPage from './pages/AgentsPage';
import VCTPage from './pages/VCTPage';
import ProfilePage from './pages/ProfilePage';
import ChatAssistant from './components/ChatAssistant';
import Layout from './components/Layout';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4655', // VALORANT червоний
    },
    secondary: {
      main: '#0f1923', // VALORANT темно-синій
    },
    background: {
      default: '#0f1923', // Темно-синій фон
      paper: '#1c2733', // Трохи світліший синій
    },
    text: {
      primary: '#ece8e1', // Світло-бежевий текст
      secondary: '#9da3a8', // Сірий текст
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/vct" element={<VCTPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <ChatAssistant />
      </Router>
    </ThemeProvider>
  );
}

export default App;
