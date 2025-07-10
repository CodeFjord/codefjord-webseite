import express from 'express';
import Page from '../models/Page.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';

const router = express.Router();

// Get all pages (public)
router.get('/', async (req, res) => {
  try {
    const pages = await Page.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get page by slug (public - only published pages)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ 
      where: { 
        slug,
        published: true 
      } 
    });
    
    if (!page) {
      return res.status(404).json({ error: 'Seite nicht gefunden' });
    }
    
    res.json(page);
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get single page (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findByPk(id);
    
    if (!page) {
      return res.status(404).json({ error: 'Seite nicht gefunden' });
    }
    
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Create page (protected - Redakteure und Admins)
router.post('/', auth, permissions.pages.create, async (req, res) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, published } = req.body;
    
    if (!title || !slug) {
      return res.status(400).json({ error: 'Titel und Slug sind erforderlich' });
    }
    
    const page = await Page.create({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      published: published || false
    });
    
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update page (protected - Redakteure und Admins)
router.put('/:id', auth, permissions.pages.update, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, metaTitle, metaDescription, published } = req.body;
    
    const page = await Page.findByPk(id);
    if (!page) {
      return res.status(404).json({ error: 'Seite nicht gefunden' });
    }
    
    await page.update({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      published
    });
    
    res.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Delete page (protected - nur Admins)
router.delete('/:id', auth, permissions.pages.delete, async (req, res) => {
  try {
    const { id } = req.params;
    
    const page = await Page.findByPk(id);
    if (!page) {
      return res.status(404).json({ error: 'Seite nicht gefunden' });
    }
    
    await page.destroy();
    res.json({ message: 'Seite erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

export default router; 