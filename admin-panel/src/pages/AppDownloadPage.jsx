import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Download,
  QrCode2,
  Smartphone,
  Tablet,
  Apple,
  Info,
  Refresh,
  Share,
  GetApp,
  Security,
  Speed,
  Storage
} from '@mui/icons-material';
import { appApi } from '../api/appApi.js';

const AppDownloadPage = () => {
  const [appInfo, setAppInfo] = useState(null);
  const [downloadStats, setDownloadStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      setLoading(true);
      const [infoData, statsData] = await Promise.all([
        appApi.getDownloadInfo(),
        appApi.getDownloadStats()
      ]);
      setAppInfo(infoData);
      setDownloadStats(statsData);
    } catch (err) {
      console.error('Fehler beim Laden der App-Daten:', err);
      setError('Fehler beim Laden der App-Informationen');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (appInfo?.installUrl) {
      // Für iOS-Geräte: Öffne itms-services URL
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.location.href = appInfo.installUrl;
      } else {
        // Für andere Geräte: Zeige Download-Link an
        window.open(appInfo.downloadUrl, '_blank');
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = appInfo?.installUrl || appInfo?.downloadUrl;
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: appInfo.name,
          text: `Laden Sie ${appInfo.name} herunter`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: URL kopieren
      navigator.clipboard.writeText(shareUrl);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!appInfo) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Keine App-Informationen verfügbar
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          iOS App Download
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie den Ad-Hoc-Download der CodeFjord Admin iOS App
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Haupt-Download-Bereich */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Apple sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" component="h2">
                    {appInfo.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Version {appInfo.version} (Build {appInfo.buildNumber})
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Download />}
                    onClick={handleDownload}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    App herunterladen
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Share />}
                    onClick={handleShare}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    Link teilen
                  </Button>
                </Grid>
              </Grid>

              {/* QR-Code */}
              {appInfo.qrCodeUrl && (
                <Box textAlign="center" mb={3}>
                  <Typography variant="h6" gutterBottom>
                    QR-Code zum Download
                  </Typography>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      display: 'inline-block', 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: 'white'
                    }}
                  >
                    <QrCode2 sx={{ fontSize: 200, color: 'black' }} />
                  </Paper>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Scannen Sie den QR-Code mit Ihrem iPhone oder iPad
                  </Typography>
                </Box>
              )}

              {/* Installationsanweisungen */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Installationsanweisungen
                </Typography>
                <List>
                  {appInfo.installInstructions.map((instruction, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Chip 
                          label={index + 1} 
                          size="small" 
                          color="primary" 
                          sx={{ minWidth: 24, height: 24 }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={instruction} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                App-Features
              </Typography>
              <Grid container spacing={1}>
                {appInfo.features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex" alignItems="center" py={0.5}>
                      <Chip 
                        icon={<Speed />} 
                        label={feature} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Systemanforderungen */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Systemanforderungen
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Apple />
                  </ListItemIcon>
                  <ListItemText 
                    primary="iOS Version" 
                    secondary={appInfo.requirements.iosVersion} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Smartphone />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Unterstützte Geräte" 
                    secondary={appInfo.requirements.deviceTypes.join(', ')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Storage />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Speicherplatz" 
                    secondary={appInfo.requirements.storage} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Download-Statistiken */}
          {downloadStats && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Download-Statistiken
                  </Typography>
                  <Tooltip title="Aktualisieren">
                    <IconButton size="small" onClick={loadAppData}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {downloadStats.totalDownloads}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gesamt-Downloads
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {downloadStats.downloadsThisMonth}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Diesen Monat
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {downloadStats.activeUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aktive Nutzer
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {downloadStats.downloadsThisWeek}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Diese Woche
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* App-Informationen */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                App-Informationen
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Entwickler" 
                    secondary={appInfo.developer} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Support" 
                    secondary={appInfo.supportEmail} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GetApp />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Letzte Aktualisierung" 
                    secondary={new Date(appInfo.lastUpdated).toLocaleDateString('de-DE')} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppDownloadPage; 