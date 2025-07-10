import Page from '../models/Page.js';

export const getAll = async (req, res) => {
  try {
    const items = await Page.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Page.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const getBySlug = async (req, res) => {
  try {
    const item = await Page.findOne({ where: { slug: req.params.slug } });
    if (!item) return res.status(404).json({ error: 'Seite nicht gefunden.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const create = async (req, res) => {
  const { title, slug, content, metaTitle, metaDescription } = req.body;
  if (!title || !slug || !content) return res.status(400).json({ error: 'Titel, Slug und Inhalt sind Pflicht.' });
  try {
    const item = await Page.create({ title, slug, content, metaTitle, metaDescription });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Anlegen.' });
  }
};

export const update = async (req, res) => {
  try {
    const item = await Page.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    const { title, slug, content, metaTitle, metaDescription } = req.body;
    await item.update({ title, slug, content, metaTitle, metaDescription });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren.' });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Page.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen.' });
  }
}; 