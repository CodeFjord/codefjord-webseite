import Media from '../models/Media.js';
import path from 'path';
import fs from 'fs';

export const getAll = async (req, res) => {
  try {
    const items = await Media.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const upload = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
  try {
    const url = `/uploads/${req.file.filename}`;
    const item = await Media.create({ filename: req.file.filename, url, mimetype: req.file.mimetype });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern.' });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Media.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    // Datei löschen
    const filePath = path.resolve('uploads', item.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen.' });
  }
}; 