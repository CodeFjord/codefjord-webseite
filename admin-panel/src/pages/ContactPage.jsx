import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import { 
  Delete, 
  Email, 
  Visibility, 
  MarkEmailRead, 
  MarkEmailUnread, 
  Send,
  Person,
  Schedule,
  Message,
  Reply,
  Archive
} from '@mui/icons-material';
import { contactAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const statusColors = {
  neu: 'primary',
  gelesen: 'warning',
  beantwortet: 'success'
};

const ContactPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await contactAPI.getAll();
      setMessages(res.data);
    } catch (err) {
      setError('Fehler beim Laden der Kontaktanfragen.');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenDetail = (msg) => {
    setSelected(msg);
    setReplyText(msg.adminReply || '');
    setDetailOpen(true);
    if (msg.status === 'neu') handleStatus(msg.id, 'gelesen');
  };
  
  const handleCloseDetail = () => setDetailOpen(false);

  const handleStatus = async (id, status) => {
    try {
      await contactAPI.update(id, { status });
      setSuccess(`Nachricht als ${status} markiert`);
      fetchMessages();
    } catch (err) {
      setError('Fehler beim Ändern des Status');
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (!window.confirm('Möchten Sie diese Nachricht wirklich löschen?')) return;
    setSaving(true);
    try {
      await contactAPI.delete(id);
      setSuccess('Nachricht erfolgreich gelöscht');
      fetchMessages();
    } catch (err) {
      setError('Fehler beim Löschen der Nachricht');
      console.error('Error deleting message:', err);
    }
    setSaving(false);
  };

  const handleReply = async () => {
    setSaving(true);
    try {
      await contactAPI.reply(selected.id, { replyText });
      setSuccess('Antwort erfolgreich gesendet');
      fetchMessages();
      setDetailOpen(false);
    } catch (err) {
      setError('Fehler beim Senden der Antwort');
      console.error('Error sending reply:', err);
    }
    setSaving(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  // Calculate statistics
  const getMessageStats = () => {
    const total = messages.length;
    const newMessages = messages.filter(msg => msg.status === 'neu').length;
    const readMessages = messages.filter(msg => msg.status === 'gelesen').length;
    const repliedMessages = messages.filter(msg => msg.status === 'beantwortet').length;
    const todayMessages = messages.filter(msg => {
      const today = new Date();
      const msgDate = new Date(msg.createdAt);
      return msgDate.toDateString() === today.toDateString();
    }).length;

    return { total, newMessages, readMessages, repliedMessages, todayMessages };
  };

  const stats = getMessageStats();

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Kontaktanfragen
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie eingehende Kontaktanfragen und deren Antworten.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Gesamt
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Message />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Neu
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {stats.newMessages}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <MarkEmailUnread />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Gelesen
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {stats.readMessages}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <MarkEmailRead />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Beantwortet
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {stats.repliedMessages}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <Reply />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Heute
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {stats.todayMessages}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Antwortrate
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="text.secondary">
                    {stats.total > 0 ? Math.round((stats.repliedMessages / stats.total) * 100) : 0}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'grey.200', color: 'grey.600' }}>
                  <Archive />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {/* Messages Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Absender</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Betreff</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nachricht</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Datum</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {msg.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {msg.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {msg.subject || 'Kein Betreff'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {msg.message.slice(0, 50)}{msg.message.length > 50 ? '…' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(msg.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={msg.status} 
                      color={statusColors[msg.status]} 
                      size="small"
                      variant={msg.status === 'neu' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Details anzeigen">
                        <IconButton 
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDetail(msg)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Als gelesen markieren">
                        <IconButton 
                          size="small"
                          color="warning"
                          onClick={() => handleStatus(msg.id, 'gelesen')} 
                          disabled={msg.status === 'gelesen' || msg.status === 'beantwortet'}
                        >
                          <MarkEmailRead />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Als neu markieren">
                        <IconButton 
                          size="small"
                          color="primary"
                          onClick={() => handleStatus(msg.id, 'neu')} 
                          disabled={msg.status === 'neu'}
                        >
                          <MarkEmailUnread />
                        </IconButton>
                      </Tooltip>
                      {canDelete(user?.role) && (
                        <Tooltip title="Löschen">
                          <IconButton 
                            size="small"
                            color="error" 
                            onClick={() => handleDelete(msg.id)} 
                            disabled={saving}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detail Dialog */}
      <Dialog 
        open={detailOpen} 
        onClose={handleCloseDetail} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Kontaktanfrage Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selected.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selected.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={selected.status} 
                      color={statusColors[selected.status]} 
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(selected.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Betreff: {selected.subject || 'Kein Betreff'}
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selected.message}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Antwort
                  </Typography>
                  <TextField
                    label="Antwort (wird per E-Mail gesendet)"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    disabled={selected.status === 'beantwortet'}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  {selected.adminReply && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Bisherige Antwort:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {selected.adminReply}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDetail} sx={{ borderRadius: 2 }}>
            Schließen
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={saving ? <CircularProgress size={18} /> : <Send />}
            onClick={handleReply}
            disabled={saving || !replyText || (selected && selected.status === 'beantwortet')}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            {saving ? 'Wird gesendet...' : 'Antwort senden'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default ContactPage; 