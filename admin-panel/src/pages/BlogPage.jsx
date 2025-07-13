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
  Article,
  CalendarToday,
  Person,
  Tag
} from '@mui/icons-material';
import { blogAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const BlogPage = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
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
  const [editingBlog, setEditingBlog] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    tags: ''
  });

  // Load blogs
  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll();
      setBlogs(response.data);
    } catch (error) {
      setError('Fehler beim Laden der Blog-Artikel');
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.tags && blog.tags.toLowerCase().includes(searchTerm.toLowerCase()))
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
  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        published: blog.published,
        tags: blog.tags || ''
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        published: false,
        tags: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      published: false,
      tags: ''
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
    if (field === 'title' && !editingBlog) {
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

      const blogData = {
        ...formData,
        published: formData.published
      };

      if (editingBlog) {
        await blogAPI.update(editingBlog.id, blogData);
        setSuccess('Blog-Artikel erfolgreich aktualisiert');
      } else {
        await blogAPI.create(blogData);
        setSuccess('Blog-Artikel erfolgreich erstellt');
      }

      handleCloseDialog();
      loadBlogs();
    } catch (error) {
      setError(editingBlog ? 'Fehler beim Aktualisieren des Blog-Artikels' : 'Fehler beim Erstellen des Blog-Artikels');
      console.error('Error saving blog:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      await blogAPI.update(blog.id, { ...blog, published: !blog.published });
      setSuccess(`Artikel ${blog.published ? 'zurückgezogen' : 'veröffentlicht'}`);
      loadBlogs();
    } catch (error) {
      setError('Fehler beim Ändern des Veröffentlichungsstatus');
      console.error('Error toggling publish:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (window.confirm('Möchten Sie diesen Blog-Artikel wirklich löschen?')) {
      try {
        await blogAPI.delete(id);
        setSuccess('Blog-Artikel erfolgreich gelöscht');
        loadBlogs();
      } catch (error) {
        setError('Fehler beim Löschen des Blog-Artikels');
        console.error('Error deleting blog:', error);
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
            Blog
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
            Neuer Artikel
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie Ihre Blog-Artikel und deren Veröffentlichungsstatus.
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
                    Gesamt Artikel
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {blogs.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Article />
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
                    {blogs.filter(b => b.published).length}
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
                    {blogs.filter(b => !b.published).length}
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
                    Diesen Monat
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {blogs.filter(b => {
                      const blogDate = new Date(b.createdAt);
                      const now = new Date();
                      return blogDate.getMonth() === now.getMonth() && 
                             blogDate.getFullYear() === now.getFullYear();
                    }).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <CalendarToday />
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
          placeholder="Artikel durchsuchen..."
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
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Artikel</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Erstellt</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBlogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((blog) => (
                  <TableRow key={blog.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: blog.published ? 'success.light' : 'grey.200',
                            color: blog.published ? 'success.main' : 'grey.600'
                          }}
                        >
                          <Article />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {blog.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                            {blog.excerpt || blog.content?.substring(0, 100) + '...'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Slug: {blog.slug}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {blog.tags ? (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {blog.tags.split(',').map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag.trim()}
                              size="small"
                              variant="outlined"
                              icon={<Tag />}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Keine Tags
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={blog.published ? 'Live' : 'Entwurf'} 
                        size="small" 
                        color={blog.published ? 'success' : 'default'}
                        variant={blog.published ? 'filled' : 'outlined'}
                        icon={blog.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(blog.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title={blog.published ? 'Zurückziehen' : 'Veröffentlichen'}>
                          <IconButton 
                            size="small" 
                            color={blog.published ? 'warning' : 'success'}
                            onClick={() => handleTogglePublish(blog)}
                          >
                            {blog.published ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Bearbeiten">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(blog)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {canDelete(user?.role) && (
                          <Tooltip title="Löschen">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(blog.id)}
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
          count={filteredBlogs.length}
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
            {editingBlog ? 'Artikel bearbeiten' : 'Neuer Artikel'}
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
                label="Kurzbeschreibung"
                value={formData.excerpt}
                onChange={(e) => handleFormChange('excerpt', e.target.value)}
                fullWidth
                multiline
                rows={2}
                helperText="Kurze Zusammenfassung des Artikels"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tags"
                value={formData.tags}
                onChange={(e) => handleFormChange('tags', e.target.value)}
                fullWidth
                helperText="Komma-getrennte Tags"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag />
                    </InputAdornment>
                  ),
                }}
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
                helperText="Vollständiger Artikelinhalt (HTML unterstützt)"
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
            {dialogLoading ? 'Wird gespeichert...' : (editingBlog ? 'Aktualisieren' : 'Erstellen')}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default BlogPage; 