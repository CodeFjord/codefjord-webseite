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
  Alert,
  CircularProgress,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Chip,
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
  Visibility,
  VisibilityOff,
  Work,
  Link as LinkIcon,
  CalendarToday,
  Category,
  Person
} from '@mui/icons-material';
import { portfolioAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const PortfolioPage = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
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
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    url: '',
    imageUrl: '',
    category: '',
    status: '',
    slug: '',
    client: '',
    completionDate: '',
    content: '',
    image: '',
    featured: false,
    published: false
  });

  // Load portfolios
  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getAll();
      setPortfolios(response.data);
    } catch (error) {
      setError('Fehler beim Laden der Portfolio-Projekte');
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  // Filter portfolios based on search
  const filteredPortfolios = portfolios.filter(portfolio =>
    portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.technologies.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleOpenDialog = (portfolio = null) => {
    if (portfolio) {
      setEditingPortfolio(portfolio);
      setFormData({
        title: portfolio.title,
        description: portfolio.description,
        technologies: portfolio.technologies,
        url: portfolio.url || '',
        imageUrl: portfolio.imageUrl || '',
        category: portfolio.category || '',
        status: portfolio.status || '',
        slug: portfolio.slug || '',
        client: portfolio.client || '',
        completionDate: portfolio.completionDate ? portfolio.completionDate.slice(0,10) : '',
        content: portfolio.content || '',
        image: portfolio.image || '',
        featured: !!portfolio.featured,
        published: !!portfolio.published
      });
    } else {
      setEditingPortfolio(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        url: '',
        imageUrl: '',
        category: '',
        status: '',
        slug: '',
        client: '',
        completionDate: '',
        content: '',
        image: '',
        featured: false,
        published: false
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPortfolio(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      url: '',
      imageUrl: '',
      category: '',
      status: '',
      slug: '',
      client: '',
      completionDate: '',
      content: '',
      image: '',
      featured: false,
      published: false
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // CRUD operations
  const handleSave = async () => {
    try {
      setDialogLoading(true);
      setError('');
      setSuccess('');

      if (editingPortfolio) {
        await portfolioAPI.update(editingPortfolio.id, formData);
        setSuccess('Portfolio-Projekt erfolgreich aktualisiert');
      } else {
        await portfolioAPI.create(formData);
        setSuccess('Portfolio-Projekt erfolgreich erstellt');
      }

      handleCloseDialog();
      loadPortfolios();
    } catch (error) {
      setError(editingPortfolio ? 'Fehler beim Aktualisieren des Portfolio-Projekts' : 'Fehler beim Erstellen des Portfolio-Projekts');
      console.error('Error saving portfolio:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (window.confirm('Möchten Sie dieses Portfolio-Projekt wirklich löschen?')) {
      try {
        await portfolioAPI.delete(id);
        setSuccess('Portfolio-Projekt erfolgreich gelöscht');
        loadPortfolios();
      } catch (error) {
        setError('Fehler beim Löschen des Portfolio-Projekts');
        console.error('Error deleting portfolio:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'abgeschlossen':
        return 'success';
      case 'in arbeit':
        return 'warning';
      case 'geplant':
        return 'info';
      default:
        return 'default';
    }
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
            Portfolio
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
            Neues Projekt
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie Ihre Portfolio-Projekte und deren Veröffentlichungsstatus.
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
                    Gesamt Projekte
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {portfolios.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Work />
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
                    {portfolios.filter(p => p.published).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <Visibility />
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
                    Hervorgehoben
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {portfolios.filter(p => p.featured).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Work />
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
                  <Typography variant="h4" fontWeight={700} color="text.secondary">
                    {portfolios.filter(p => !p.published).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'grey.200', color: 'grey.600' }}>
                  <VisibilityOff />
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
          placeholder="Projekte durchsuchen..."
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
                <TableCell sx={{ fontWeight: 600 }}>Projekt</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kategorie</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Veröffentlicht</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Datum</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPortfolios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((portfolio) => (
                  <TableRow key={portfolio.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={portfolio.imageUrl} 
                          sx={{ width: 48, height: 48 }}
                        >
                          <Work />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {portfolio.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                            {portfolio.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={portfolio.category || 'Keine Kategorie'} 
                        size="small" 
                        variant="outlined"
                        icon={<Category />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={portfolio.status || 'Nicht definiert'} 
                        size="small" 
                        color={getStatusColor(portfolio.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={portfolio.published ? 'Live' : 'Entwurf'} 
                        size="small" 
                        color={portfolio.published ? 'success' : 'default'}
                        variant={portfolio.published ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(portfolio.completionDate)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Bearbeiten">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(portfolio)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {canDelete(user?.role) && (
                          <Tooltip title="Löschen">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(portfolio.id)}
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
          count={filteredPortfolios.length}
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
            {editingPortfolio ? 'Projekt bearbeiten' : 'Neues Projekt'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Titel"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
                label="Beschreibung"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Kategorie"
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Status"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Kunde"
                value={formData.client}
                onChange={(e) => handleFormChange('client', e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Fertigstellungsdatum"
                type="date"
                value={formData.completionDate}
                onChange={(e) => handleFormChange('completionDate', e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Technologien"
                value={formData.technologies}
                onChange={(e) => handleFormChange('technologies', e.target.value)}
                fullWidth
                helperText="Komma-getrennte Liste von Technologien"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Projekt-URL"
                value={formData.url}
                onChange={(e) => handleFormChange('url', e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bild-URL"
                value={formData.imageUrl}
                onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                fullWidth
                helperText="URL zum Projektbild"
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
                rows={6}
                helperText="Detaillierte Projektbeschreibung"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.featured}
                      onChange={(e) => handleFormChange('featured', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Hervorgehoben"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.published}
                      onChange={(e) => handleFormChange('published', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Veröffentlicht"
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
            {dialogLoading ? 'Wird gespeichert...' : (editingPortfolio ? 'Aktualisieren' : 'Erstellen')}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default PortfolioPage; 