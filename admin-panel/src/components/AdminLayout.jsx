import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  AppBar, 
  IconButton, 
  Typography, 
  Box, 
  Divider, 
  Button,
  Avatar,
  Badge,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Dashboard, 
  Work, 
  Article, 
  Description, 
  Image, 
  Mail, 
  Menu as MenuIcon, 
  Logout, 
  People, 
  ListAlt, 
  Group,
  Notifications,
  AccountCircle,
  Settings,
  ExpandLess,
  ExpandMore,
  Home,
  Business,
  School,
  Support,
  Edit,
  Save,
  Close,
  ContactMail,
  PhotoLibrary,
  MenuBook,
  Person,
  Delete,
  CheckCircle,
  Warning,
  Info,
  Error,
  GetApp
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../store/auth';
import { authAPI } from '../api/client';
import useNotifications from '../hooks/useNotifications';
import { canDelete } from '../utils/permissions';
import codefjordLogo from '../assets/codefjord.png';

const drawerWidth = 280;

const navItems = [
  { 
    label: 'Dashboard', 
    icon: <Dashboard />, 
    path: '/',
    description: 'Übersicht und Statistiken',
    color: 'primary',
    roles: ['admin', 'redakteur']
  },
  { 
    label: 'Portfolio', 
    icon: <Work />, 
    path: '/portfolio',
    description: 'Projekte verwalten',
    color: 'success',
    roles: ['admin', 'redakteur']
  },
  { 
    label: 'Blog', 
    icon: <Article />, 
    path: '/blog',
    description: 'Artikel und Beiträge',
    color: 'warning',
    roles: ['admin', 'redakteur']
  },
  { 
    label: 'Seiten', 
    icon: <Description />, 
    path: '/pages',
    description: 'Statische Seiten',
    color: 'info',
    roles: ['admin', 'redakteur']
  },
  { 
    label: 'Team', 
    icon: <Group />, 
    path: '/team',
    description: 'Team-Mitglieder',
    color: 'secondary',
    roles: ['admin', 'redakteur']
  },
  { 
    label: 'Menüs', 
    icon: <ListAlt />, 
    path: '/menus',
    description: 'Navigation verwalten',
    color: 'error',
    roles: ['admin']
  },
  { 
    label: 'Media', 
    icon: <Image />, 
    path: '/media',
    description: 'Dateien und Bilder',
    color: 'primary',
    roles: ['admin', 'redakteur']
  },
  { 
    label: 'Kontakt', 
    icon: <Mail />, 
    path: '/contact',
    description: 'Nachrichten verwalten',
    color: 'success',
    roles: ['admin', 'redakteur']
  },
  { 
    label: 'Benutzer', 
    icon: <People />, 
    path: '/users',
    description: 'Benutzerverwaltung',
    color: 'warning',
    roles: ['admin']
  },
  { 
    label: 'App Download', 
    icon: <GetApp />, 
    path: '/app-download',
    description: 'iOS App herunterladen',
    color: 'info',
    roles: ['admin']
  },
];

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  // Benutzerdaten aus dem Auth-Store oder Fallback
  const currentUser = user ? {
    name: user.name || user.email?.split('@')[0] || 'Administrator',
    email: user.email || 'admin@codefjord.de',
            role: user.role === 'admin' ? 'Administrator' : 'Redakteur',
    avatar: null
  } : {
    name: 'Administrator',
    email: 'admin@codefjord.de',
    role: 'Administrator',
    avatar: null
  };

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'de',
    autoSave: true
  });

  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Aktualisiere Profildaten wenn sich der Benutzer ändert
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || user.email?.split('@')[0] || 'Administrator',
        email: user.email || 'admin@codefjord.de'
      }));
    }
  }, [user]);

  // Filtere Navigation basierend auf Benutzerrolle
  const getFilteredNavItems = () => {
    if (!user) return navItems;
    return navItems.filter(item => item.roles.includes(user.role));
  };

  const filteredNavItems = getFilteredNavItems();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleNotificationClick = (notification) => {
    // Als gelesen markieren
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.type === 'contact') {
      navigate('/contact');
    } else if (notification.type === 'blog') {
      navigate('/blog');
    } else if (notification.type === 'portfolio') {
      navigate('/portfolio');
    }
    
    handleNotificationsClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (event, notificationId) => {
    event.stopPropagation();
    if (!canDelete(user?.role)) {
      alert('Keine Berechtigung zum Löschen');
      return;
    }
    deleteNotification(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contact':
        return <Mail fontSize="small" />;
      case 'blog':
        return <Article fontSize="small" />;
      case 'portfolio':
        return <Work fontSize="small" />;
      case 'user':
        return <Person fontSize="small" />;
      case 'system':
        return <Info fontSize="small" />;
      default:
        return <Notifications fontSize="small" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'error';
    if (priority === 'high') return 'warning';
    
    switch (type) {
      case 'contact':
        return 'primary';
      case 'blog':
        return 'success';
      case 'portfolio':
        return 'info';
      case 'user':
        return 'secondary';
      case 'system':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
    handleUserMenuClose();
  };

  const handleProfileOpen = () => {
    setProfileOpen(true);
    handleUserMenuClose();
  };

  const handleSettingsSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSettingsOpen(false);
  };

  const handleProfileSave = async () => {
    try {
      // Validierung
      if (!profileData.name.trim()) {
        alert('Name ist erforderlich');
        return;
      }

      if (!profileData.email) {
        alert('E-Mail ist erforderlich');
        return;
      }

      // Profil-Daten für API vorbereiten
      const profileUpdateData = {
        name: profileData.name.trim(),
        email: profileData.email
      };
      
      // Passwort ändern wenn alle Felder ausgefüllt sind
      if (profileData.currentPassword && profileData.newPassword && profileData.confirmPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          alert('Neue Passwörter stimmen nicht überein');
          return;
        }
        
        if (profileData.newPassword.length < 6) {
          alert('Neues Passwort muss mindestens 6 Zeichen lang sein');
          return;
        }

        profileUpdateData.currentPassword = profileData.currentPassword;
        profileUpdateData.newPassword = profileData.newPassword;
      }

      // API-Call für Profil-Update
      const response = await authAPI.updateProfile(profileUpdateData);
      
      // Lokalen State aktualisieren
      const updatedUser = {
        ...user,
        name: response.data.name,
        email: response.data.email
      };
      
      updateUser(updatedUser);
      
      // Erfolgsmeldung
      alert('Profil erfolgreich aktualisiert');
      setProfileOpen(false);
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      const errorMessage = error.response?.data?.error || 'Fehler beim Speichern des Profils';
      alert(errorMessage);
    }
  };

  const getCurrentPageInfo = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem || navItems[0];
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Logo/Brand Section */}
      <Box sx={{ 
        p: 3, 
        mt: { xs: 7, sm: 8 },
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute', 
          top: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.10)',
              position: 'relative',
              overflow: 'hidden',
              p: 0.5
            }}
          >
            <img
              src={codefjordLogo}
              alt="CodeFjord Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
              CodeFjord
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Content Management System
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List sx={{ px: 2 }}>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip 
                key={item.label} 
                title={item.description} 
                placement="right"
                arrow
              >
                <ListItem
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    mb: 1,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: `linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)`,
                      borderRadius: '0 2px 2px 0'
                    } : {},
                    '&.Mui-selected': {
                      backgroundColor: `${item.color}.light`,
                      color: `${item.color}.main`,
                      '&:hover': {
                        backgroundColor: `${item.color}.main`,
                        color: 'white',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'inherit',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 44,
                    color: isActive ? 'inherit' : 'text.secondary'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem'
                    }}
                  />
                  {isActive && (
                    <Chip 
                      label="Aktiv" 
                      size="small" 
                      color={item.color}
                      variant="filled"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* User Section */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 44, 
              height: 44, 
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} />
            ) : (
              getInitials(currentUser.name)
            )}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {currentUser.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentUser.role}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Logout />}
          onClick={handleLogout}
          size="small"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Abmelden
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 1, 
                display: { sm: 'none' },
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                {getCurrentPageInfo().icon}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {getCurrentPageInfo().label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getCurrentPageInfo().description}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Benachrichtigungen">
              <IconButton 
                color="inherit" 
                size="small"
                onClick={handleNotificationsOpen}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Einstellungen">
              <IconButton 
                color="inherit" 
                size="small"
                onClick={handleSettingsOpen}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Benutzerprofil">
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  {getInitials(currentUser.name)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={handleProfileOpen}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profil bearbeiten
        </MenuItem>
        <MenuItem onClick={handleSettingsOpen}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Einstellungen
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          Abmelden
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minWidth: 350,
            maxHeight: 500
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Benachrichtigungen
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
              >
                Alle als gelesen markieren
              </Button>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {unreadCount} ungelesen von {notifications.length} Benachrichtigungen
          </Typography>
        </Box>
        
        {notificationsLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Keine Benachrichtigungen vorhanden
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={() => handleNotificationClick(notification)}
              sx={{ 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
                opacity: notification.read ? 0.7 : 1,
                backgroundColor: notification.read ? 'transparent' : 'action.hover'
              }}
            >
              <ListItemIcon>
                <Box sx={{ 
                  color: getNotificationColor(notification.type, notification.priority),
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {getNotificationIcon(notification.type)}
                </Box>
              </ListItemIcon>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography 
                    variant="body2" 
                    fontWeight={notification.read ? 400 : 600}
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {notification.title}
                  </Typography>
                  {canDelete(user?.role) && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      sx={{ 
                        opacity: 0.5,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.timeAgo}
                </Typography>
              </Box>
              {!notification.read && (
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: 'primary.main',
                  ml: 1
                }} />
              )}
            </MenuItem>
          ))
        )}
        
        {notifications.length > 10 && (
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Zeige 10 von {notifications.length} Benachrichtigungen
            </Typography>
          </Box>
        )}
      </Menu>

      {/* Settings Dialog */}
      <Dialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Einstellungen
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                  color="primary"
                />
              }
              label="Benachrichtigungen aktivieren"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, darkMode: e.target.checked }))}
                  color="primary"
                />
              }
              label="Dark Mode"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                  color="primary"
                />
              }
              label="Auto-Save aktivieren"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sprache</InputLabel>
              <Select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                label="Sprache"
              >
                <MenuItem value="de">Deutsch</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setSettingsOpen(false)} sx={{ borderRadius: 2 }}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSettingsSave}
            variant="contained"
            startIcon={<Save />}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Profil bearbeiten
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="E-Mail"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Passwort ändern
            </Typography>
            <TextField
              label="Aktuelles Passwort"
              type="password"
              value={profileData.currentPassword}
              onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Neues Passwort"
              type="password"
              value={profileData.newPassword}
              onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Neues Passwort bestätigen"
              type="password"
              value={profileData.confirmPassword}
              onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setProfileOpen(false)} sx={{ borderRadius: 2 }}>
            Abbrechen
          </Button>
          <Button
            onClick={handleProfileSave}
            variant="contained"
            startIcon={<Save />}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout; 