import express from 'express';
import Blog from '../models/Blog.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';

const router = express.Router();

// Get all blog posts (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get blog post by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ where: { slug } });
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog-Artikel nicht gefunden' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get single blog post (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog-Post nicht gefunden' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Create blog post (protected - Redakteure und Admins)
router.post('/', auth, permissions.blog.create, async (req, res) => {
  try {
    const { title, slug, excerpt, content, published, tags } = req.body;
    
    if (!title || !slug) {
      return res.status(400).json({ error: 'Titel und Slug sind erforderlich' });
    }
    
    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      published: published || false,
      tags
    });
    
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update blog post (protected - Redakteure und Admins)
router.put('/:id', auth, permissions.blog.update, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, published, tags } = req.body;
    
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog-Post nicht gefunden' });
    }
    
    await blog.update({
      title,
      slug,
      excerpt,
      content,
      published,
      tags
    });
    
    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Delete blog post (protected - nur Admins)
router.delete('/:id', auth, permissions.blog.delete, async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog-Post nicht gefunden' });
    }
    
    await blog.destroy();
    res.json({ message: 'Blog-Post erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

export default router; 