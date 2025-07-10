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
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Menu,
  Link,
  Navigation,
  List,
  Settings
} from '@mui/icons-material';
import { menusAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const MenusPage = () => {
  const { user } = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog state
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  
  // Form state
  const [menuForm, setMenuForm] = useState({
    name: '',
    location: 'navbar',
    active: true
  });
  
  const [itemForm, setItemForm] = useState({
    label: '',
    url: '',
    target: '_self',
    order: 0,
    active: true,
    parentId: null
  });

  // Load menus
  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await menusAPI.getAll();
      setMenus(response.data);
    } catch (error) {
      setError('Fehler beim Laden der Menüs');
      console.error('Error loading menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // Menu dialog handlers
  const handleOpenMenuDialog = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setMenuForm({
        name: menu.name,
        location: menu.location,
        active: menu.active
      });
    } else {
      setEditingMenu(null);
      setMenuForm({
        name: '',
        location: 'navbar',
        active: true
      });
    }
    setMenuDialogOpen(true);
  };

  const handleCloseMenuDialog = () => {
    setMenuDialogOpen(false);
    setEditingMenu(null);
    setMenuForm({
      name: '',
      location: 'navbar',
      active: true
    });
  };

  // Item dialog handlers
  const handleOpenItemDialog = (menu, item = null) => {
    setSelectedMenu(menu);
    if (item) {
      setEditingItem(item);
      setItemForm({
        label: item.label,
        url: item.url,
        target: item.target,
        order: item.order,
        active: item.active,
        parentId: item.parentId
      });
    } else {
      setEditingItem(null);
      setItemForm({
        label: '',
        url: '',
        target: '_self',
        order: menu.items?.length || 0,
        active: true,
        parentId: null
      });
    }
    setItemDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
    setEditingItem(null);
    setSelectedMenu(null);
    setItemForm({
      label: '',
      url: '',
      target: '_self',
      order: 0,
      active: true,
      parentId: null
    });
  };

  // CRUD operations for menus
  const handleSaveMenu = async () => {
    try {
      setDialogLoading(true);
      setError('');
      setSuccess('');

      if (editingMenu) {
        await menusAPI.update(editingMenu.id, menuForm);
        setSuccess('Menü erfolgreich aktualisiert');
      } else {
        await menusAPI.create(menuForm);
        setSuccess('Menü erfolgreich erstellt');
      }

      handleCloseMenuDialog();
      loadMenus();
    } catch (error) {
      setError(editingMenu ? 'Fehler beim Aktualisieren des Menüs' : 'Fehler beim Erstellen des Menüs');
      console.error('Error saving menu:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (!window.confirm('Möchten Sie dieses Menü wirklich löschen? Alle Menüpunkte werden ebenfalls gelöscht.')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await menusAPI.delete(menuId);
      setSuccess('Menü erfolgreich gelöscht');
      loadMenus();
    } catch (error) {
      setError('Fehler beim Löschen des Menüs');
      console.error('Error deleting menu:', error);
    }
  };

  // CRUD operations for menu items
  const handleSaveItem = async () => {
    try {
      setDialogLoading(true);
      setError('');
      setSuccess('');

      if (editingItem) {
        await menusAPI.updateItem(editingItem.id, itemForm);
        setSuccess('Menüpunkt erfolgreich aktualisiert');
      } else {
        await menusAPI.createItem(selectedMenu.id, itemForm);
        setSuccess('Menüpunkt erfolgreich erstellt');
      }

      handleCloseItemDialog();
      loadMenus();
    } catch (error) {
      setError(editingItem ? 'Fehler beim Aktualisieren des Menüpunkts' : 'Fehler beim Erstellen des Menüpunkts');
      console.error('Error saving menu item:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (!window.confirm('Möchten Sie diesen Menüpunkt wirklich löschen?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await menusAPI.deleteItem(itemId);
      setSuccess('Menüpunkt erfolgreich gelöscht');
      loadMenus();
    } catch (error) {
      setError('Fehler beim Löschen des Menüpunkts');
      console.error('Error deleting menu item:', error);
    }
  };

  // Calculate statistics
  const getMenuStats = () => {
    const totalMenus = menus.length;
    const activeMenus = menus.filter(menu => menu.active).length;
    const totalItems = menus.reduce((sum, menu) => sum + (menu.items?.length || 0), 0);
    const activeItems = menus.reduce((sum, menu) => 
      sum + (menu.items?.filter(item => item.active).length || 0), 0
    );
    const navbarMenus = menus.filter(menu => menu.location === 'navbar').length;
    const footerMenus = menus.filter(menu => menu.location === 'footer').length;

    return { totalMenus, activeMenus, totalItems, activeItems, navbarMenus, footerMenus };
  };

  const stats = getMenuStats();

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
            Menüs
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenMenuDialog()}
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
            Neues Menü
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie Ihre Navigationsmenüs und deren Menüpunkte.
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
                    Gesamt Menüs
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {stats.totalMenus}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Menu />
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
                    Aktive Menüs
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {stats.activeMenus}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <VisibilityIcon />
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
                    Gesamt Punkte
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {stats.totalItems}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <List />
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
                    Aktive Punkte
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {stats.activeItems}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <Link />
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
                    Navbar
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {stats.navbarMenus}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                  <Navigation />
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
                    Footer
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="text.secondary">
                    {stats.footerMenus}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'grey.200', color: 'grey.600' }}>
                  <Settings />
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

      {/* Menus List */}
      <Box sx={{ mb: 4 }}>
        {menus.map((menu) => (
          <Accordion key={menu.id} sx={{ mb: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: menu.active ? 'success.light' : 'grey.200',
                    color: menu.active ? 'success.main' : 'grey.600'
                  }}
                >
                  <Menu />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {menu.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip 
                      label={menu.location} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      label={menu.active ? 'Aktiv' : 'Inaktiv'} 
                      size="small" 
                      color={menu.active ? 'success' : 'default'}
                      variant={menu.active ? 'filled' : 'outlined'}
                    />
                    <Chip 
                      label={`${menu.items?.length || 0} Punkte`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Menüpunkt hinzufügen">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenItemDialog(menu);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Menü bearbeiten">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMenuDialog(menu);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {canDelete(user?.role) && (
                    <Tooltip title="Menü löschen">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMenu(menu.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {menu.items && menu.items.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Label</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>URL</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Target</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Reihenfolge</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Aktionen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {menu.items
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DragIcon color="action" />
                                <Typography variant="body2" fontWeight={500}>
                                  {item.label}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                                {item.url}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.target} 
                                size="small" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.order} 
                                size="small" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.active ? 'Aktiv' : 'Inaktiv'} 
                                size="small" 
                                color={item.active ? 'success' : 'default'}
                                variant={item.active ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Tooltip title="Bearbeiten">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleOpenItemDialog(menu, item)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                {canDelete(user?.role) && (
                                  <Tooltip title="Löschen">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteItem(item.id)}
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
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Keine Menüpunkte vorhanden
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenItemDialog(menu)}
                    sx={{ mt: 1 }}
                  >
                    Ersten Menüpunkt hinzufügen
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Menu Dialog */}
      <Dialog
        open={menuDialogOpen}
        onClose={handleCloseMenuDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {editingMenu ? 'Menü bearbeiten' : 'Neues Menü'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={menuForm.name}
              onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
              fullWidth
              required
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Position</InputLabel>
              <Select
                value={menuForm.location}
                onChange={(e) => setMenuForm({ ...menuForm, location: e.target.value })}
                label="Position"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MuiMenuItem value="navbar">Navigation (Navbar)</MuiMenuItem>
                <MuiMenuItem value="footer">Footer</MuiMenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={menuForm.active}
                  onChange={(e) => setMenuForm({ ...menuForm, active: e.target.checked })}
                  color="primary"
                />
              }
              label="Menü aktiv"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseMenuDialog} sx={{ borderRadius: 2 }}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSaveMenu}
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
            {dialogLoading ? 'Wird gespeichert...' : (editingMenu ? 'Aktualisieren' : 'Erstellen')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog
        open={itemDialogOpen}
        onClose={handleCloseItemDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {editingItem ? 'Menüpunkt bearbeiten' : 'Neuer Menüpunkt'}
          </Typography>
          {selectedMenu && (
            <Typography variant="body2" color="text.secondary">
              Menü: {selectedMenu.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Label"
              value={itemForm.label}
              onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
              fullWidth
              required
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="URL"
              value={itemForm.url}
              onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
              fullWidth
              required
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Target</InputLabel>
              <Select
                value={itemForm.target}
                onChange={(e) => setItemForm({ ...itemForm, target: e.target.value })}
                label="Target"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MuiMenuItem value="_self">Gleicher Tab (_self)</MuiMenuItem>
                <MuiMenuItem value="_blank">Neuer Tab (_blank)</MuiMenuItem>
                <MuiMenuItem value="_parent">Übergeordneter Frame (_parent)</MuiMenuItem>
                <MuiMenuItem value="_top">Vollständiges Fenster (_top)</MuiMenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Reihenfolge"
              type="number"
              value={itemForm.order}
              onChange={(e) => setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })}
              fullWidth
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={itemForm.active}
                  onChange={(e) => setItemForm({ ...itemForm, active: e.target.checked })}
                  color="primary"
                />
              }
              label="Menüpunkt aktiv"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseItemDialog} sx={{ borderRadius: 2 }}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSaveItem}
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
            {dialogLoading ? 'Wird gespeichert...' : (editingItem ? 'Aktualisieren' : 'Erstellen')}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default MenusPage; 