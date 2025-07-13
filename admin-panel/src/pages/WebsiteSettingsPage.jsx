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
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Settings,
  Schedule,
  Build,
  Refresh,
  Info,
  Warning,
  CheckCircle,
  Error,
  ExpandMore,
  Public,
  Edit,
  Save,
  Visibility,
  VisibilityOff,
  AccessTime,
  Message,
  Title
} from '@mui/icons-material';

const WebsiteSettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [expanded, setExpanded] = useState('coming-soon');
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

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
            <Settings sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Website-Einstellungen
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Verwalten Sie die Website-Modi und konfigurieren Sie Coming Soon und Wartungsmodus
          </Typography>
        </Box>

        {/* Status Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={6}>
            <Card 
              elevation={isComingSoonActive ? 8 : 2} 
              sx={{ 
                height: '100%',
                background: isComingSoonActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'background.paper',
                color: isComingSoonActive ? 'white' : 'text.primary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isComingSoonActive ? 12 : 4
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ 
                      bgcolor: isComingSoonActive ? 'rgba(255,255,255,0.2)' : 'primary.main',
                      mr: 2 
                    }}>
                      <Schedule />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        Coming Soon Mode
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Countdown bis zur Veröffentlichung
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={isComingSoonActive ? 'AKTIV' : 'INAKTIV'} 
                    color={isComingSoonActive ? 'default' : 'default'}
                    variant={isComingSoonActive ? 'filled' : 'outlined'}
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: isComingSoonActive ? 'rgba(255,255,255,0.2)' : 'transparent'
                    }}
                  />
                </Box>
                
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Zeigt eine elegante Countdown-Seite an, bis Ihre Website vollständig verfügbar ist
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={isComingSoonActive}
                      onChange={async () => await handleToggle('coming_soon_enabled', 'Coming Soon Mode aktivieren/deaktivieren')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: isComingSoonActive ? 'white' : 'primary.main',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: isComingSoonActive ? 'rgba(255,255,255,0.3)' : 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Coming Soon Mode aktivieren
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card 
              elevation={isMaintenanceActive ? 8 : 2} 
              sx={{ 
                height: '100%',
                background: isMaintenanceActive ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'background.paper',
                color: isMaintenanceActive ? 'white' : 'text.primary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isMaintenanceActive ? 12 : 4
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ 
                      bgcolor: isMaintenanceActive ? 'rgba(255,255,255,0.2)' : 'warning.main',
                      mr: 2 
                    }}>
                      <Build />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        Wartungsmodus
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Technische Wartungsarbeiten
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={isMaintenanceActive ? 'AKTIV' : 'INAKTIV'} 
                    color={isMaintenanceActive ? 'default' : 'default'}
                    variant={isMaintenanceActive ? 'filled' : 'outlined'}
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: isMaintenanceActive ? 'rgba(255,255,255,0.2)' : 'transparent'
                    }}
                  />
                </Box>
                
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Zeigt eine professionelle Wartungsseite während technischer Arbeiten
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={isMaintenanceActive}
                      onChange={async () => await handleToggle('maintenance_enabled', 'Wartungsmodus aktivieren/deaktivieren')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: isMaintenanceActive ? 'white' : 'warning.main',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: isMaintenanceActive ? 'rgba(255,255,255,0.3)' : 'warning.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Wartungsmodus aktivieren
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Priority Warning */}
        {(isComingSoonActive || isMaintenanceActive) && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: 28 }
            }}
            icon={<Info sx={{ fontSize: 28 }} />}
          >
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Wichtiger Hinweis zur Priorität
            </Typography>
            <Typography variant="body2">
              <strong>Wartungsmodus hat Vorrang:</strong> Wenn beide Modi aktiviert sind, wird der Wartungsmodus angezeigt. 
              Der Coming Soon Mode wird nur angezeigt, wenn der Wartungsmodus deaktiviert ist.
            </Typography>
          </Alert>
        )}

        {/* Configuration Sections */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Coming Soon Configuration */}
          <Grid item xs={12} md={6}>
            <Accordion 
              expanded={expanded === 'coming-soon'} 
              onChange={handleAccordionChange('coming-soon')}
              sx={{ 
                height: '100%',
                '&:before': { display: 'none' },
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ 
                  bgcolor: isComingSoonActive ? 'primary.light' : 'grey.50',
                  '&:hover': { bgcolor: isComingSoonActive ? 'primary.main' : 'grey.100' }
                }}
              >
                <Box display="flex" alignItems="center">
                  <Schedule color={isComingSoonActive ? 'white' : 'primary'} sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600} color={isComingSoonActive ? 'white' : 'text.primary'}>
                    Coming Soon Konfiguration
                  </Typography>
                  {isComingSoonActive && (
                    <Chip 
                      label="AKTIV" 
                      size="small" 
                      sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 4 }}>
                {isComingSoonActive ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Countdown-Datum"
                        type="datetime-local"
                        value={settings.coming_soon_date?.value ? new Date(settings.coming_soon_date.value).toISOString().slice(0, 16) : ''}
                        onChange={async (e) => await handleDateChange('coming_soon_date', e.target.value, 'Datum für Coming Soon Countdown (ISO String)')}
                        InputLabelProps={{ shrink: true }}
                        helperText="Wählen Sie das Datum, bis wann der Countdown laufen soll"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTime color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Titel"
                        value={settings.coming_soon_title?.value || ''}
                        onChange={async (e) => await handleTextChange('coming_soon_title', e.target.value, 'Titel für Coming Soon Seite')}
                        placeholder="Wir kommen bald!"
                        helperText="Der Haupttitel der Coming Soon Seite"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Title color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nachricht"
                        multiline
                        rows={4}
                        value={settings.coming_soon_message?.value || ''}
                        onChange={async (e) => await handleTextChange('coming_soon_message', e.target.value, 'Nachricht für Coming Soon Seite')}
                        placeholder="Wir arbeiten hart daran, unsere neue Website zu erstellen. Bald sind wir online!"
                        helperText="Die Hauptnachricht, die Besuchern angezeigt wird"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Message color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Schedule sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Coming Soon Mode ist deaktiviert
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aktivieren Sie den Coming Soon Mode oben, um die Konfiguration zu bearbeiten
                    </Typography>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Maintenance Configuration */}
          <Grid item xs={12} md={6}>
            <Accordion 
              expanded={expanded === 'maintenance'} 
              onChange={handleAccordionChange('maintenance')}
              sx={{ 
                height: '100%',
                '&:before': { display: 'none' },
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ 
                  bgcolor: isMaintenanceActive ? 'warning.light' : 'grey.50',
                  '&:hover': { bgcolor: isMaintenanceActive ? 'warning.main' : 'grey.100' }
                }}
              >
                <Box display="flex" alignItems="center">
                  <Build color={isMaintenanceActive ? 'white' : 'warning'} sx={{ mr: 2 }} />
                  <Typography variant="h6" fontWeight={600} color={isMaintenanceActive ? 'white' : 'text.primary'}>
                    Wartungsmodus Konfiguration
                  </Typography>
                  {isMaintenanceActive && (
                    <Chip 
                      label="AKTIV" 
                      size="small" 
                      sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 4 }}>
                {isMaintenanceActive ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Titel"
                        value={settings.maintenance_title?.value || ''}
                        onChange={async (e) => await handleTextChange('maintenance_title', e.target.value, 'Titel für Wartungsmodus Seite')}
                        placeholder="Wartungsmodus"
                        helperText="Der Haupttitel der Wartungsseite"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Title color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nachricht"
                        multiline
                        rows={4}
                        value={settings.maintenance_message?.value || ''}
                        onChange={async (e) => await handleTextChange('maintenance_message', e.target.value, 'Nachricht für Wartungsmodus')}
                        placeholder="Wir führen gerade Wartungsarbeiten durch. Bitte versuchen Sie es später erneut."
                        helperText="Die Hauptnachricht, die Besuchern angezeigt wird"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Message color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Build sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Wartungsmodus ist deaktiviert
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aktivieren Sie den Wartungsmodus oben, um die Konfiguration zu bearbeiten
                    </Typography>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Schnellaktionen
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={loadSettings}
                  disabled={saving}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Neu laden
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Public />}
                  onClick={() => window.open('/', '_blank')}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Frontend ansehen
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => window.open('/?admin_token=true', '_blank')}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Admin-Vorschau
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={loadSettings}
                  disabled={saving}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Alle speichern
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Message Display */}
        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: 28 }
            }}
            onClose={() => setMessage({ text: '', type: '' })}
          >
            {message.text}
          </Alert>
        )}

        {/* Loading Overlay */}
        {saving && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgcolor="rgba(0,0,0,0.7)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999}
          >
            <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3, borderRadius: 3 }}>
              <CircularProgress size={32} />
              <Typography variant="h6">Speichere Einstellungen...</Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </AdminLayout>
  );
};

export default WebsiteSettingsPage; 