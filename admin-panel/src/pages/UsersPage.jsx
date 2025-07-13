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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Security,
  Group,
  VerifiedUser,
  Block,
  Email,
  AccountCircle,
  CalendarToday,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { usersAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const UsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
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
  const [editingUser, setEditingUser] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'redakteur',
    active: true
  });

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      setError('Fehler beim Laden der Benutzer');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role || 'redakteur',
        active: user.active !== false
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'redakteur',
        active: true
      });
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
              role: 'redakteur',
        active: true
      });
    setShowPassword(false);
    setShowConfirmPassword(false);
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

      // Validation
      if (!formData.name.trim()) {
        setError('Name ist erforderlich');
        return;
      }

      if (!formData.email) {
        setError('E-Mail ist erforderlich');
        return;
      }

      if (!editingUser && !formData.password) {
        setError('Passwort ist erforderlich für neue Benutzer');
        return;
      }

      if (formData.password && formData.password !== formData.confirmPassword) {
        setError('Passwörter stimmen nicht überein');
        return;
      }

      const userData = {
        name: formData.name.trim(),
        email: formData.email,
        role: formData.role,
        active: formData.active
      };

      // Only include password if it's provided
      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        await usersAPI.update(editingUser.id, userData);
        setSuccess('Benutzer erfolgreich aktualisiert');
      } else {
        await usersAPI.create(userData);
        setSuccess('Benutzer erfolgreich erstellt');
      }

      handleCloseDialog();
      loadUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Fehler beim Speichern des Benutzers');
      console.error('Error saving user:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (window.confirm(`Möchten Sie den Benutzer "${userName}" wirklich löschen?`)) {
      try {
        await usersAPI.delete(userId);
        setSuccess('Benutzer erfolgreich gelöscht');
        loadUsers();
      } catch (error) {
        setError('Fehler beim Löschen des Benutzers');
        console.error('Error deleting user:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(user => user.active).length;
    const admins = users.filter(user => user.role === 'admin').length;
    const redakteure = users.filter(user => user.role === 'redakteur').length;
    
    return { total, active, admins, redakteure };
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ maxWidth: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Benutzerverwaltung
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Verwalten Sie alle Benutzer und deren Berechtigungen
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Gesamt Benutzer
                    </Typography>
                  </Box>
                  <Group sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.active}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Aktive Benutzer
                    </Typography>
                  </Box>
                  <VerifiedUser sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.admins}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Administratoren
                    </Typography>
                  </Box>
                  <AdminIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.redakteure}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Redakteure
                    </Typography>
                  </Box>
                  <UserIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Actions and Search */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            Neuen Benutzer erstellen
          </Button>
          
          <TextField
            placeholder="Benutzer suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
        </Box>

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

        {/* Users Table */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <TableContainer>
            <Table>
                          <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Benutzer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>E-Mail</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rolle</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Letzter Login</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                              width: 40,
                              height: 40,
                              fontSize: '0.9rem',
                              fontWeight: 600
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {user.name || 'Unbekannt'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'admin' ? 'Administrator' : 'Redakteur'}
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                          icon={user.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.active ? 'Aktiv' : 'Inaktiv'}
                          color={user.active ? 'success' : 'error'}
                          size="small"
                          icon={user.active ? <Visibility /> : <VisibilityOff />}
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {formatDate(user.lastLogin)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Bearbeiten">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(user)}
                              sx={{ 
                                borderRadius: 2,
                                '&:hover': { backgroundColor: 'primary.light' }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {canDelete(user?.role) && (
                            <Tooltip title="Löschen">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(user.id, user.name)}
                                sx={{ 
                                  borderRadius: 2,
                                  '&:hover': { backgroundColor: 'error.light' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Zeilen pro Seite:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
          />
        </Paper>

        {/* User Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {editingUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                fullWidth
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="E-Mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                fullWidth
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Rolle</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                  label="Rolle"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminIcon fontSize="small" />
                      Administrator
                    </Box>
                  </MenuItem>
                  <MenuItem value="redakteur">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UserIcon fontSize="small" />
                      Redakteur
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              
              <Divider sx={{ my: 2 }} />
              
              {!editingUser && (
                <>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Passwort setzen
                  </Typography>
                  <TextField
                    label="Passwort"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleFormChange('password', e.target.value)}
                    fullWidth
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Security />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Passwort bestätigen"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                    fullWidth
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Security />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => handleFormChange('active', e.target.checked)}
                    color="primary"
                  />
                }
                label="Benutzer ist aktiv"
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={dialogLoading}
              startIcon={dialogLoading ? <CircularProgress size={16} /> : null}
              sx={{
                borderRadius: 2,
                px: 3,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                }
              }}
            >
              {dialogLoading ? 'Speichern...' : 'Speichern'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default UsersPage; 