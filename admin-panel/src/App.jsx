import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import PagesPage from './pages/PagesPage';
import TeamMembersPage from './pages/TeamMembersPage';
import MenusPage from './pages/MenusPage';
import MediaPage from './pages/MediaPage';
import ContactPage from './pages/ContactPage';
import UsersPage from './pages/UsersPage';
import AppDownloadPage from './pages/AppDownloadPage';
import WebsiteSettingsPage from './pages/WebsiteSettingsPage';
import './App.css'
import { useEffect } from 'react';
import { useAuthStore } from './store/auth';

function App() {
  useEffect(() => {
    // User-Daten nach Reload laden, falls Token vorhanden
    useAuthStore.getState().refreshUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <PortfolioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <BlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pages"
            element={
              <ProtectedRoute>
                <PagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <TeamMembersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menus"
            element={
              <ProtectedRoute>
                <MenusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/media"
            element={
              <ProtectedRoute>
                <MediaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app-download"
            element={
              <ProtectedRoute>
                <AppDownloadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/website-settings"
            element={
              <ProtectedRoute>
                <WebsiteSettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
