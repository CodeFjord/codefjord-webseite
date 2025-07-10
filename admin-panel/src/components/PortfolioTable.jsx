import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, TablePagination, InputAdornment } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import api from '../api/client';

const rowsPerPageDefault = 10;

const emptyForm = { title: '', description: '', image: '', category: '', link: '' };

const PortfolioTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/portfolio');
      setProjects(res.data);
    } catch (err) {
      setError('Fehler beim Laden der Projekte.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Suche/Filter
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const paginatedProjects = filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  // Create
  const handleOpenCreate = () => {
    setForm(emptyForm);
    setOpenCreate(true);
  };
  const handleCloseCreate = () => setOpenCreate(false);
  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/portfolio', form);
      handleCloseCreate();
      fetchProjects();
    } catch (err) {
      setError('Fehler beim Anlegen.');
    } finally {
      setSaving(false);
    }
  };

  // Edit
  const handleOpenEdit = (row) => {
    setEditId(row.id);
    setForm({ ...row });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/portfolio/${editId}`, form);
      handleCloseEdit();
      fetchProjects();
    } catch (err) {
      setError('Fehler beim Aktualisieren.');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);
  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/portfolio/${deleteId}`);
      handleCloseDelete();
      fetchProjects();
    } catch (err) {
      setError('Fehler beim Löschen.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePageChange = (e, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Portfolio Übersicht
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Suche"
          value={search}
          onChange={handleSearch}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ maxWidth: 300 }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          Neu
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titel</TableCell>
                  <TableCell>Beschreibung</TableCell>
                  <TableCell>Kategorie</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Featured</TableCell>
                  <TableCell>Published</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Fertigstellung</TableCell>
                  <TableCell>Technologien</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>GitHub</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Bild</TableCell>
                  <TableCell align="right">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProjects.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.featured ? 'Ja' : 'Nein'}</TableCell>
                    <TableCell>{row.published ? 'Ja' : 'Nein'}</TableCell>
                    <TableCell>{row.slug}</TableCell>
                    <TableCell>{row.client}</TableCell>
                    <TableCell>{row.completionDate}</TableCell>
                    <TableCell>{row.technologies.join(', ')}</TableCell>
                    <TableCell>{row.link}</TableCell>
                    <TableCell>{row.githubUrl}</TableCell>
                    <TableCell>{row.content}</TableCell>
                    <TableCell>{row.image}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}><Edit /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleOpenDelete(row.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredProjects.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={handleCloseCreate} fullWidth maxWidth="sm">
        <DialogTitle>Neues Projekt anlegen</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Titel" name="title" value={form.title} onChange={handleChange} required fullWidth />
            <TextField label="Beschreibung" name="description" value={form.description} onChange={handleChange} required fullWidth multiline minRows={2} />
            <TextField label="Kategorie" name="category" value={form.category} onChange={handleChange} fullWidth />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange} fullWidth />
            <TextField label="Featured" name="featured" value={form.featured ? 'Ja' : 'Nein'} onChange={handleChange} fullWidth />
            <TextField label="Published" name="published" value={form.published ? 'Ja' : 'Nein'} onChange={handleChange} fullWidth />
            <TextField label="Slug" name="slug" value={form.slug} onChange={handleChange} fullWidth />
            <TextField label="Client" name="client" value={form.client} onChange={handleChange} fullWidth />
            <TextField label="Fertigstellung" name="completionDate" value={form.completionDate} onChange={handleChange} fullWidth />
            <TextField label="Technologien" name="technologies" value={form.technologies.join(', ')} onChange={handleChange} fullWidth />
            <TextField label="Link" name="link" value={form.link} onChange={handleChange} fullWidth />
            <TextField label="GitHub" name="githubUrl" value={form.githubUrl} onChange={handleChange} fullWidth />
            <TextField label="Content" name="content" value={form.content} onChange={handleChange} fullWidth />
            <TextField label="Bild (URL)" name="image" value={form.image} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate} disabled={saving}>Abbrechen</Button>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Projekt bearbeiten</DialogTitle>
        <form onSubmit={handleEdit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Titel" name="title" value={form.title} onChange={handleChange} required fullWidth />
            <TextField label="Beschreibung" name="description" value={form.description} onChange={handleChange} required fullWidth multiline minRows={2} />
            <TextField label="Kategorie" name="category" value={form.category} onChange={handleChange} fullWidth />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange} fullWidth />
            <TextField label="Featured" name="featured" value={form.featured ? 'Ja' : 'Nein'} onChange={handleChange} fullWidth />
            <TextField label="Published" name="published" value={form.published ? 'Ja' : 'Nein'} onChange={handleChange} fullWidth />
            <TextField label="Slug" name="slug" value={form.slug} onChange={handleChange} fullWidth />
            <TextField label="Client" name="client" value={form.client} onChange={handleChange} fullWidth />
            <TextField label="Fertigstellung" name="completionDate" value={form.completionDate} onChange={handleChange} fullWidth />
            <TextField label="Technologien" name="technologies" value={form.technologies.join(', ')} onChange={handleChange} fullWidth />
            <TextField label="Link" name="link" value={form.link} onChange={handleChange} fullWidth />
            <TextField label="GitHub" name="githubUrl" value={form.githubUrl} onChange={handleChange} fullWidth />
            <TextField label="Content" name="content" value={form.content} onChange={handleChange} fullWidth />
            <TextField label="Bild (URL)" name="image" value={form.image} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} disabled={saving}>Abbrechen</Button>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Projekt löschen?</DialogTitle>
        <DialogContent>
          <Typography>Möchtest du dieses Projekt wirklich löschen?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={saving}>Abbrechen</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={saving}>{saving ? 'Lösche...' : 'Löschen'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PortfolioTable; 