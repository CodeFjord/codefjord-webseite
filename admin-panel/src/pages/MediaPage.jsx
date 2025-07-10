import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
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
  Chip,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Storage,
  PhotoLibrary,
  Movie,
  MusicNote,
  Description
} from '@mui/icons-material';
import { mediaAPI } from '../api/client';
import AdminLayout from '../components/AdminLayout';
import useAuth from '../store/auth';
import { canDelete } from '../utils/permissions';

const MediaPage = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload dialog
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load media
  const loadMedia = async () => {
    try {
      setLoading(true);
      const response = await mediaAPI.getAll();
      setMedia(response.data);
    } catch (error) {
      setError('Fehler beim Laden der Medien');
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // Filter media based on search
  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.alt && item.alt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get file type icon
  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return <ImageIcon />;
    if (mimeType.startsWith('video/')) return <VideoIcon />;
    if (mimeType.startsWith('audio/')) return <AudioIcon />;
    return <FileIcon />;
  };

  // Get file type color
  const getFileTypeColor = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'success';
    if (mimeType.startsWith('video/')) return 'warning';
    if (mimeType.startsWith('audio/')) return 'info';
    return 'default';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    if (files.length > 0) {
      setUploadDialogOpen(true);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        await mediaAPI.upload(formData);
      }

      setSuccess(`${selectedFiles.length} Datei(en) erfolgreich hochgeladen`);
      setUploadDialogOpen(false);
      setSelectedFiles([]);
      loadMedia();
    } catch (error) {
      setError('Fehler beim Hochladen der Dateien');
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (mediaId, filename) => {
    if (!canDelete(user?.role)) {
      setError('Keine Berechtigung zum Löschen');
      return;
    }

    if (!window.confirm(`Möchten Sie die Datei "${filename}" wirklich löschen?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await mediaAPI.delete(mediaId);
      setSuccess('Datei erfolgreich gelöscht');
      loadMedia();
    } catch (error) {
      setError('Fehler beim Löschen der Datei');
      console.error('Error deleting media:', error);
    }
  };

  // Update alt text
  const handleUpdateAlt = async (mediaId, newAlt) => {
    try {
      await mediaAPI.update(mediaId, { alt: newAlt });
      setSuccess('Alt-Text erfolgreich aktualisiert');
      loadMedia();
    } catch (error) {
      setError('Fehler beim Aktualisieren des Alt-Texts');
      console.error('Error updating alt text:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  // Calculate statistics
  const getMediaStats = () => {
    const images = media.filter(item => item.mimeType.startsWith('image/')).length;
    const videos = media.filter(item => item.mimeType.startsWith('video/')).length;
    const audios = media.filter(item => item.mimeType.startsWith('audio/')).length;
    const documents = media.filter(item => !item.mimeType.startsWith('image/') && !item.mimeType.startsWith('video/') && !item.mimeType.startsWith('audio/')).length;
    const totalSize = media.reduce((sum, item) => sum + (item.size || 0), 0);

    return { images, videos, audios, documents, totalSize };
  };

  const stats = getMediaStats();

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
            Medien
          </Typography>
          <Box>
            <input
              accept="*/*"
              style={{ display: 'none' }}
              id="file-upload"
              multiple
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
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
                Dateien hochladen
              </Button>
            </label>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie Ihre Medien-Dateien und deren Metadaten.
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
                    {media.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Storage />
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
                    Bilder
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {stats.images}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <PhotoLibrary />
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
                    Videos
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {stats.videos}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Movie />
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
                    Audio
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {stats.audios}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <MusicNote />
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
                    Dokumente
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {stats.documents}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                  <Description />
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
                    Gesamtgröße
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="text.secondary">
                    {formatFileSize(stats.totalSize)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'grey.200', color: 'grey.600' }}>
                  <Storage />
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
          placeholder="Medien durchsuchen..."
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

      {/* Media Grid */}
      <Grid container spacing={3}>
        {filteredMedia.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                {item.mimeType.startsWith('image/') ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.url}
                    alt={item.alt || item.filename}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      position: 'relative'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: `${getFileTypeColor(item.mimeType)}.light`,
                        color: `${getFileTypeColor(item.mimeType)}.main`
                      }}
                    >
                      {getFileIcon(item.mimeType)}
                    </Avatar>
                  </Box>
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <Chip
                    label={item.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                    size="small"
                    color={getFileTypeColor(item.mimeType)}
                    variant="filled"
                  />
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {item.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {formatFileSize(item.size)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(item.createdAt)}
                </Typography>
                {item.alt && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Alt: {item.alt}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Alt-Text bearbeiten">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        const newAlt = prompt('Neuer Alt-Text:', item.alt || '');
                        if (newAlt !== null) {
                          handleUpdateAlt(item.id, newAlt);
                        }
                      }}
                    >
                      <Description />
                    </IconButton>
                  </Tooltip>
                </Box>
                {canDelete(user?.role) && (
                  <Tooltip title="Löschen">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.id, item.filename)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Dateien hochladen
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedFiles.length} Datei(en) ausgewählt:
            </Typography>
            {selectedFiles.map((file, index) => (
              <Box key={index} sx={{ mb: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(file.size)} • {file.type || 'Unbekannter Typ'}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setUploadDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={18} /> : <UploadIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            {uploading ? 'Wird hochgeladen...' : 'Hochladen'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default MediaPage; 