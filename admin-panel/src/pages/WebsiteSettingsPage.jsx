import { useState, useEffect } from 'react';
import { appApi } from '../api/appApi.js';
import apiClient from '../api/client.js';
import useNotifications from '../hooks/useNotifications.js';
import AdminLayout from '../components/AdminLayout.jsx';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Settings,
  Schedule,
  Build,
  Refresh,
  Info,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';

const WebsiteSettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const notifications = useNotifications();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/website-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Website-Einstellungen:', error);
      setMessage({ text: 'Fehler beim Laden der Einstellungen', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value, description) => {
    try {
      setSaving(true);
      await apiClient.post('/website-settings', {
        key,
        value: String(value),
        description
      });
      
      // Aktualisiere lokalen State
      setSettings(prev => ({
        ...prev,
        [key]: {
          value: String(value),
          description
        }
      }));
      
      setMessage({ text: 'Einstellung erfolgreich gespeichert', type: 'success' });
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellung:', error);
      setMessage({ text: 'Fehler beim Speichern der Einstellung', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (key, description) => {
    const currentValue = settings[key]?.value === 'true';
    const newValue = !currentValue;
    
    // Sofort lokalen State aktualisieren für bessere UX
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: String(newValue)
      }
    }));
    
    // Dann an Backend senden
    try {
      await updateSetting(key, newValue, description);
    } catch (error) {
      // Bei Fehler lokalen State zurücksetzen
      setSettings(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: String(currentValue)
        }
      }));
    }
  };

  const handleDateChange = async (key, value, description) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }));
    // Markiere als geändert
    setEditing(prev => ({ ...prev, [key]: true }));
    // Speichere sofort
    try {
      await updateSetting(key, value, description);
    } catch (error) {
      console.error('Fehler beim Speichern des Datums:', error);
    }
  };

  const handleTextChange = async (key, value, description) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }));
    // Markiere als geändert
    setEditing(prev => ({ ...prev, [key]: true }));
    // Speichere sofort
    try {
      await updateSetting(key, value, description);
    } catch (error) {
      console.error('Fehler beim Speichern des Textes:', error);
    }
  };



  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </AdminLayout>
    );
  }

  const isComingSoonActive = settings.coming_soon_enabled?.value === 'true';
  const isMaintenanceActive = settings.maintenance_enabled?.value === 'true';

  return (
    <AdminLayout>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            <Settings sx={{ mr: 2, verticalAlign: 'middle' }} />
            Website-Einstellungen
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Verwalten Sie die Website-Modi und Einstellungen für Coming Soon und Wartungsmodus
          </Typography>
        </Box>

        {/* Status Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, border: isComingSoonActive ? 2 : 1, borderColor: isComingSoonActive ? 'primary.main' : 'divider' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <Schedule color={isComingSoonActive ? 'primary' : 'disabled'} sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Coming Soon Mode
                  </Typography>
                </Box>
                <Chip 
                  label={isComingSoonActive ? 'Aktiv' : 'Inaktiv'} 
                  color={isComingSoonActive ? 'primary' : 'default'}
                  variant={isComingSoonActive ? 'filled' : 'outlined'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Zeigt eine Countdown-Seite an, bis die Website vollständig verfügbar ist
              </Typography>
                              <FormControlLabel
                  control={
                    <Switch
                      checked={isComingSoonActive}
                      onChange={async () => await handleToggle('coming_soon_enabled', 'Coming Soon Mode aktivieren/deaktivieren')}
                      color="primary"
                    />
                  }
                  label="Coming Soon Mode aktivieren"
                />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, border: isMaintenanceActive ? 2 : 1, borderColor: isMaintenanceActive ? 'warning.main' : 'divider' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <Build color={isMaintenanceActive ? 'warning' : 'disabled'} sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Wartungsmodus
                  </Typography>
                </Box>
                <Chip 
                  label={isMaintenanceActive ? 'Aktiv' : 'Inaktiv'} 
                  color={isMaintenanceActive ? 'warning' : 'default'}
                  variant={isMaintenanceActive ? 'filled' : 'outlined'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Zeigt eine Wartungsseite an, während technische Arbeiten durchgeführt werden
              </Typography>
                              <FormControlLabel
                  control={
                    <Switch
                      checked={isMaintenanceActive}
                      onChange={async () => await handleToggle('maintenance_enabled', 'Wartungsmodus aktivieren/deaktivieren')}
                      color="warning"
                    />
                  }
                  label="Wartungsmodus aktivieren"
                />
            </Paper>
          </Grid>
        </Grid>

        {/* Coming Soon Settings */}
        {isComingSoonActive && (
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Schedule color="primary" sx={{ mr: 2 }} />
                <Typography variant="h5" fontWeight={600}>
                  Coming Soon Einstellungen
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Countdown-Datum"
                    type="datetime-local"
                    value={settings.coming_soon_date?.value ? new Date(settings.coming_soon_date.value).toISOString().slice(0, 16) : ''}
                    onChange={async (e) => await handleDateChange('coming_soon_date', e.target.value, 'Datum für Coming Soon Countdown (ISO String)')}
                    InputLabelProps={{ shrink: true }}
                    helperText="Wählen Sie das Datum, bis wann der Countdown laufen soll"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Titel"
                    value={settings.coming_soon_title?.value || ''}
                    onChange={async (e) => await handleTextChange('coming_soon_title', e.target.value, 'Titel für Coming Soon Seite')}
                    placeholder="Wir kommen bald!"
                    helperText="Der Haupttitel der Coming Soon Seite"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nachricht"
                    multiline
                    rows={3}
                    value={settings.coming_soon_message?.value || ''}
                    onChange={async (e) => await handleTextChange('coming_soon_message', e.target.value, 'Nachricht für Coming Soon Seite')}
                    placeholder="Wir arbeiten hart daran, unsere neue Website zu erstellen. Bald sind wir online!"
                    helperText="Die Hauptnachricht, die Besuchern angezeigt wird"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Maintenance Settings */}
        {isMaintenanceActive && (
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Build color="warning" sx={{ mr: 2 }} />
                <Typography variant="h5" fontWeight={600}>
                  Wartungsmodus Einstellungen
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Titel"
                    value={settings.maintenance_title?.value || ''}
                    onChange={async (e) => await handleTextChange('maintenance_title', e.target.value, 'Titel für Wartungsmodus Seite')}
                    placeholder="Wartungsmodus"
                    helperText="Der Haupttitel der Wartungsseite"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nachricht"
                    multiline
                    rows={3}
                    value={settings.maintenance_message?.value || ''}
                    onChange={async (e) => await handleTextChange('maintenance_message', e.target.value, 'Nachricht für Wartungsmodus')}
                    placeholder="Wir führen gerade Wartungsarbeiten durch. Bitte versuchen Sie es später erneut."
                    helperText="Die Hauptnachricht, die Besuchern angezeigt wird"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Priority Warning */}
        {(isComingSoonActive || isMaintenanceActive) && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Prioritätsreihenfolge:</strong> Wartungsmodus hat Vorrang vor Coming Soon Mode. 
              Wenn beide aktiviert sind, wird der Wartungsmodus angezeigt.
            </Typography>
          </Alert>
        )}

        {/* Message Display */}
        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 3 }}
            onClose={() => setMessage({ text: '', type: '' })}
          >
            {message.text}
          </Alert>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadSettings}
            disabled={saving}
          >
            Neu laden
          </Button>
        </Box>

        {/* Loading Overlay */}
        {saving && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgcolor="rgba(0,0,0,0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999}
          >
            <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography>Speichere Einstellungen...</Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </AdminLayout>
  );
};

export default WebsiteSettingsPage; 