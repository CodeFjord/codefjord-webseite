import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Work,
  Article,
  Description,
  Group,
  Mail,
  TrendingUp,
  TrendingDown,
  Visibility,
  Edit,
  Delete,
  Add
} from '@mui/icons-material';
import { portfolioAPI, blogAPI, pagesAPI, teamMembersAPI, contactAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';

const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight={700} color="text.primary">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend > 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
              )}
              <Typography 
                variant="caption" 
                color={trend > 0 ? 'success.main' : 'error.main'}
                fontWeight={500}
              >
                {Math.abs(trend)}% {trend > 0 ? 'Zunahme' : 'Abnahme'}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar 
          sx={{ 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            width: 56,
            height: 56
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const RecentItem = ({ title, subtitle, icon, color, action }) => (
  <ListItem sx={{ px: 0 }}>
    <ListItemAvatar>
      <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
        {icon}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={title}
      secondary={subtitle}
      primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
      secondaryTypographyProps={{ fontSize: '0.75rem' }}
    />
    {action && (
      <Box>
        {action}
      </Box>
    )}
  </ListItem>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    portfolio: 0,
    blog: 0,
    pages: 0,
    team: 0,
    contacts: 0
  });
  const [recentItems, setRecentItems] = useState({
    portfolio: [],
    blog: [],
    contacts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load data with error handling for permissions
      const [portfolioData, blogData, pagesData, teamData] = await Promise.all([
        portfolioAPI.getAll(),
        blogAPI.getAll(),
        pagesAPI.getAll(),
        teamMembersAPI.getAll()
      ]);

      // Load contact data (Redakteure und Admins können lesen)
      const contactData = await contactAPI.getAll();

      setStats({
        portfolio: portfolioData.data.length,
        blog: blogData.data.length,
        pages: pagesData.data.length,
        team: teamData.data.length,
        contacts: contactData.data.length
      });

      // Get recent items (last 5)
      setRecentItems({
        portfolio: portfolioData.data.slice(0, 5),
        blog: blogData.data.slice(0, 5),
        contacts: contactData.data.slice(0, 5)
      });

    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Willkommen zurück! Hier ist eine Übersicht über Ihre Inhalte.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Portfolio Projekte"
            value={stats.portfolio}
            icon={<Work />}
            color="primary"
            trend={12}
            subtitle="Aktive Projekte"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Blog Artikel"
            value={stats.blog}
            icon={<Article />}
            color="secondary"
            trend={-5}
            subtitle="Veröffentlichte Artikel"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Seiten"
            value={stats.pages}
            icon={<Description />}
            color="info"
            trend={0}
            subtitle="Statische Seiten"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Mitglieder"
            value={stats.team}
            icon={<Group />}
            color="success"
            trend={8}
            subtitle="Aktive Mitglieder"
          />
        </Grid>
      </Grid>

      {/* Recent Content */}
      <Grid container spacing={3}>
        {/* Recent Portfolio Items */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Neueste Projekte
                </Typography>
                <Tooltip title="Neues Projekt erstellen">
                  <IconButton size="small" color="primary">
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
              <List sx={{ py: 0 }}>
                {recentItems.portfolio.map((item) => (
                  <RecentItem
                    key={item.id}
                    title={item.title}
                    subtitle={`${item.category || 'Projekt'} • ${new Date(item.createdAt).toLocaleDateString('de-DE')}`}
                    icon={<Work />}
                    color="primary"
                    action={
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Bearbeiten">
                          <IconButton size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Löschen">
                          <IconButton size="small" color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                ))}
                {recentItems.portfolio.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Keine Projekte vorhanden
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Blog Posts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Neueste Artikel
                </Typography>
                <Tooltip title="Neuen Artikel erstellen">
                  <IconButton size="small" color="primary">
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
              <List sx={{ py: 0 }}>
                {recentItems.blog.map((item) => (
                  <RecentItem
                    key={item.id}
                    title={item.title}
                    subtitle={`${item.published ? 'Veröffentlicht' : 'Entwurf'} • ${new Date(item.createdAt).toLocaleDateString('de-DE')}`}
                    icon={<Article />}
                    color="secondary"
                    action={
                      <Chip 
                        label={item.published ? 'Live' : 'Entwurf'} 
                        size="small" 
                        color={item.published ? 'success' : 'default'}
                        variant={item.published ? 'filled' : 'outlined'}
                      />
                    }
                  />
                ))}
                {recentItems.blog.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Keine Artikel vorhanden
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Contact Messages - Only for users with contact access */}
        {['admin', 'redakteur'].includes(user?.role) && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Neueste Nachrichten
                  </Typography>
                  <Tooltip title="Alle Nachrichten anzeigen">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </Box>
                <List sx={{ py: 0 }}>
                  {recentItems.contacts.map((item) => (
                    <RecentItem
                      key={item.id}
                      title={item.name}
                      subtitle={`${item.email} • ${item.subject} • ${new Date(item.createdAt).toLocaleDateString('de-DE')}`}
                      icon={<Mail />}
                      color="warning"
                      action={
                        <Chip 
                          label={item.status || 'Neu'} 
                          size="small" 
                          color={item.status === 'beantwortet' ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      }
                    />
                  ))}
                  {recentItems.contacts.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      Keine Nachrichten vorhanden
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </AdminLayout>
  );
};

export default Dashboard; 