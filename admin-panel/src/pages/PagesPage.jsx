import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Description,
  CalendarToday,
  Language,
  Tag as SeoIcon
} from '@mui/icons-material';
import { pagesAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const PagesPage = () => {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    published: false
  });

  // Load pages
  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await pagesAPI.getAll();
      setPages(response.data);
    } catch (error) {
      setError('Fehler beim Laden der Seiten');
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  // Filter pages based on search
  const filteredPages = pages.filter(pageItem =>
    pageItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pageItem.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dialog handlers
  const handleOpenDialog = (pageItem = null) => {
    if (pageItem) {
      setEditingPage(pageItem);
      setFormData({
        title: pageItem.title,
        slug: pageItem.slug,
        content: pageItem.content || '',
        metaTitle: pageItem.metaTitle || '',
        metaDescription: pageItem.metaDescription || '',
        published: pageItem.published
      });
    } else {
      setEditingPage(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        published: false
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      published: false
    });
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[äöüß]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match]))
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate slug when title changes
    if (field === 'title' && !editingPage) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  // CRUD operations
  const handleSave = async () => {
    try {
      setDialogLoading(true);
      setError('');
      setSuccess('');

      const pageData = {
        ...formData,
        published: formData.published
      };

      if (editingPage) {
        await pagesAPI.update(editingPage.id, pageData);
        setSuccess('Seite erfolgreich aktualisiert');
      } else {
        await pagesAPI.create(pageData);
        setSuccess('Seite erfolgreich erstellt');
      }

      handleCloseDialog();
      loadPages();
    } catch (error) {
      setError(editingPage ? 'Fehler beim Aktualisieren der Seite' : 'Fehler beim Erstellen der Seite');
      console.error('Error saving page:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (window.confirm('Möchten Sie diese Seite wirklich löschen?')) {
      try {
        await pagesAPI.delete(id);
        setSuccess('Seite erfolgreich gelöscht');
        loadPages();
      } catch (error) {
        setError('Fehler beim Löschen der Seite');
        console.error('Error deleting page:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

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
            Seiten
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            Neue Seite
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie Ihre statischen Seiten und deren Veröffentlichungsstatus.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Gesamt Seiten
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {pages.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Description />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Veröffentlicht
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {pages.filter(p => p.published).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <VisibilityIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Entwürfe
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {pages.filter(p => !p.published).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <VisibilityOffIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    Mit SEO
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {pages.filter(p => p.metaTitle || p.metaDescription).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <Language />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Seiten durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Paper>

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

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Seite</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>SEO</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Erstellt</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pageItem) => (
                  <TableRow key={pageItem.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: pageItem.published ? 'success.light' : 'grey.200',
                            color: pageItem.published ? 'success.main' : 'grey.600'
                          }}
                        >
                          <Description />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {pageItem.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                            {pageItem.content?.substring(0, 100) + '...'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                        /{pageItem.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pageItem.published ? 'Live' : 'Entwurf'} 
                        size="small" 
                        color={pageItem.published ? 'success' : 'default'}
                        variant={pageItem.published ? 'filled' : 'outlined'}
                        icon={pageItem.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {pageItem.metaTitle && (
                          <Chip label="Title" size="small" variant="outlined" color="success" />
                        )}
                        {pageItem.metaDescription && (
                          <Chip label="Desc" size="small" variant="outlined" color="info" />
                        )}
                        {!pageItem.metaTitle && !pageItem.metaDescription && (
                          <Typography variant="body2" color="text.secondary">
                            Keine SEO-Daten
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(pageItem.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Bearbeiten">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(pageItem)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {canDelete(user?.role) && (
                          <Tooltip title="Löschen">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(pageItem.id)}
                            >
                              <DeleteIcon />
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
        <TablePagination
          component="div"
          count={filteredPages.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Zeilen pro Seite:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
        />
      </Paper>

      {/* Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {editingPage ? 'Seite bearbeiten' : 'Neue Seite'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Titel"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleFormChange('slug', e.target.value)}
                fullWidth
                helperText="URL-freundlicher Name"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Inhalt"
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                fullWidth
                multiline
                rows={12}
                helperText="Vollständiger Seiteninhalt (HTML unterstützt)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                SEO-Einstellungen
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Meta Title"
                value={formData.metaTitle}
                onChange={(e) => handleFormChange('metaTitle', e.target.value)}
                fullWidth
                helperText="Titel für Suchmaschinen (optional)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Meta Description"
                value={formData.metaDescription}
                onChange={(e) => handleFormChange('metaDescription', e.target.value)}
                fullWidth
                multiline
                rows={3}
                helperText="Beschreibung für Suchmaschinen (optional)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Chip
                  label={formData.published ? 'Veröffentlicht' : 'Entwurf'}
                  color={formData.published ? 'success' : 'default'}
                  variant={formData.published ? 'filled' : 'outlined'}
                  icon={formData.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  onClick={() => handleFormChange('published', !formData.published)}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={dialogLoading}
            startIcon={dialogLoading ? <CircularProgress size={18} /> : null}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            {dialogLoading ? 'Wird gespeichert...' : (editingPage ? 'Aktualisieren' : 'Erstellen')}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default PagesPage; 