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
  Avatar,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person,
  Work,
  Sort,
  Group
} from '@mui/icons-material';
import { teamMembersAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const TeamMembersPage = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
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
  const [editingMember, setEditingMember] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    order: 0
  });

  // Load team members
  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamMembersAPI.getAll();
      setTeamMembers(response.data);
    } catch (error) {
      setError('Fehler beim Laden der Team-Mitglieder');
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  // Filter team members based on search
  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.bio && member.bio.toLowerCase().includes(searchTerm.toLowerCase()))
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
  const handleOpenDialog = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio || '',
        imageUrl: member.imageUrl || '',
        order: member.order || 0
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        bio: '',
        imageUrl: '',
        order: 0
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      imageUrl: '',
      order: 0
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

      if (editingMember) {
        await teamMembersAPI.update(editingMember.id, formData);
        setSuccess('Team-Mitglied erfolgreich aktualisiert');
      } else {
        await teamMembersAPI.create(formData);
        setSuccess('Team-Mitglied erfolgreich erstellt');
      }

      handleCloseDialog();
      loadTeamMembers();
    } catch (error) {
      setError(editingMember ? 'Fehler beim Aktualisieren des Team-Mitglieds' : 'Fehler beim Erstellen des Team-Mitglieds');
      console.error('Error saving team member:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (window.confirm('Möchten Sie dieses Team-Mitglied wirklich löschen?')) {
      try {
        await teamMembersAPI.delete(id);
        setSuccess('Team-Mitglied erfolgreich gelöscht');
        loadTeamMembers();
      } catch (error) {
        setError('Fehler beim Löschen des Team-Mitglieds');
        console.error('Error deleting team member:', error);
      }
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
            Team-Mitglieder
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
            Neues Mitglied
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie Ihre Team-Mitglieder und deren Reihenfolge in der Anzeige.
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
                    Gesamt Mitglieder
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {teamMembers.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Group />
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
                    Mit Bild
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {teamMembers.filter(m => m.imageUrl).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <Person />
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
                    Mit Bio
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {teamMembers.filter(m => m.bio).length}
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
                    Sortiert
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {teamMembers.filter(m => m.order > 0).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <Sort />
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
          placeholder="Team-Mitglieder durchsuchen..."
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
                <TableCell sx={{ fontWeight: 600 }}>Mitglied</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rolle</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reihenfolge</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeamMembers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={member.imageUrl} 
                          sx={{ width: 48, height: 48 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {member.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={member.role} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        icon={<Work />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {member.bio || 'Keine Bio verfügbar'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={member.order || 0} 
                        size="small" 
                        variant="outlined"
                        icon={<Sort />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Bearbeiten">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(member)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {canDelete(user?.role) && (
                          <Tooltip title="Löschen">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(member.id)}
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
          count={filteredTeamMembers.length}
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
            {editingMember ? 'Mitglied bearbeiten' : 'Neues Mitglied'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                fullWidth
                required
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
                label="Rolle"
                value={formData.role}
                onChange={(e) => handleFormChange('role', e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work />
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
                helperText="URL zum Profilbild (optional)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Reihenfolge"
                type="number"
                value={formData.order}
                onChange={(e) => handleFormChange('order', parseInt(e.target.value) || 0)}
                fullWidth
                helperText="Sortierreihenfolge (0 = automatisch)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Sort />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                value={formData.bio}
                onChange={(e) => handleFormChange('bio', e.target.value)}
                fullWidth
                multiline
                rows={4}
                helperText="Kurze Beschreibung des Team-Mitglieds"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
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
            {dialogLoading ? 'Wird gespeichert...' : (editingMember ? 'Aktualisieren' : 'Erstellen')}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default TeamMembersPage; 