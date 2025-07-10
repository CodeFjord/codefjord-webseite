import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Media from '../models/Media.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';

const router = express.Router();

// Upload-Ordner anlegen, falls nicht vorhanden
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all media files (public)
router.get('/', async (req, res) => {
  try {
    const media = await Media.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get single media file (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);
    
    if (!media) {
      return res.status(404).json({ error: 'Media-Datei nicht gefunden' });
    }
    
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Create media file (protected - Redakteure und Admins)
router.post('/', auth, permissions.media.create, async (req, res) => {
  try {
    const { filename, originalName, mimeType, size, path } = req.body;
    if (!filename || !originalName || !mimeType) {
      return res.status(400).json({ error: 'Datei-Informationen sind erforderlich' });
    }
    const media = await Media.create({ ...req.body });
    res.status(201).json(media);
  } catch (error) {
    console.error('Error creating media:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update media file (protected - Redakteure und Admins)
router.put('/:id', auth, permissions.media.update, async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'Media-Datei nicht gefunden' });
    }
    await media.update({ ...req.body });
    res.json(media);
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Delete media file (protected - nur Admins)
router.delete('/:id', auth, permissions.media.delete, async (req, res) => {
  try {
    const { id } = req.params;
    
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'Media-Datei nicht gefunden' });
    }
    
    await media.destroy();
    res.json({ message: 'Media-Datei erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

export default router; 