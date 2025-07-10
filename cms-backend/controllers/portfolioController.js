import Portfolio from '../models/Portfolio.js';

export const getAll = async (req, res) => {
  try {
    const items = await Portfolio.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const create = async (req, res) => {
  const { title, description, image, category, link } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Titel und Beschreibung sind Pflicht.' });
  try {
    const item = await Portfolio.create({ title, description, image, category, link });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Anlegen.' });
  }
};

export const update = async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    const { title, description, image, category, link } = req.body;
    await item.update({ title, description, image, category, link });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren.' });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen.' });
  }
}; 