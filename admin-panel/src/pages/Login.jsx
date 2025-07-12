import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/auth';
import codefjordLogo from '../assets/codefjord.png';
import codefjordLogoWhite from '../assets/codefjord-white.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        minWidth: '100vw',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(37, 99, 235, 0.10)',
        }}
      >
        {/* Logo und Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img
              src={theme.palette.mode === 'dark' ? codefjordLogoWhite : codefjordLogo}
              alt="CodeFjord Logo"
              style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 12, 
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 2px 8px rgba(37,99,235,0.10)'
              }}
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Willkommen im Admin-Panel
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Bitte melden Sie sich mit Ihren Zugangsdaten an.
          </Typography>
        </Box>
        {/* Setup Info */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            }
          }}
        >
          <Typography variant="body2">
            <strong>Ersteinrichtung:</strong><br/>
            Zum Erstellen eines Benutzers, melde dich bei Luca unter <a href="mailto:luca@code-fjord.de">kohls@code-fjord.de</a>
          </Typography>
        </Alert>
        <form onSubmit={handleSubmit} autoComplete="on">
          <TextField
            label="E-Mail-Adresse"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            label="Passwort"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
            <Button variant="text" size="small" disabled sx={{ color: 'text.disabled', textTransform: 'none' }}>
              Passwort vergessen?
            </Button>
          </Box>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '0.875rem'
                }
              }}
            >
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 2,
              mb: 1,
              borderRadius: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                  : 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                transform: 'translateY(-1px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 25px rgba(59, 130, 246, 0.4)'
                  : '0 8px 25px rgba(37, 99, 235, 0.3)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
          >
            Anmelden
          </Button>
        </form>
      </Paper>
      {/* Footer in der Card */}
      <Box sx={{ position: 'absolute', bottom: 24, left: 0, width: '100%', textAlign: 'center', pointerEvents: 'auto' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
          © {new Date().getFullYear()} CodeFjord UG (haftungsbeschränkt) i.G. Alle Rechte vorbehalten.
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <a
            href="https://code-fjord.de/impressum"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: 'rgba(255,255,255,0.9)', 
              textDecoration: 'underline', 
              fontSize: '0.85em', 
              fontWeight: 500,
              '&:hover': {
                color: '#fff'
              }
            }}
          >
            Impressum
          </a>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em' }}>|</span>
          <a
            href="https://code-fjord.de/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: 'rgba(255,255,255,0.9)', 
              textDecoration: 'underline', 
              fontSize: '0.85em', 
              fontWeight: 500,
              '&:hover': {
                color: '#fff'
              }
            }}
          >
            Datenschutz
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default Login; 