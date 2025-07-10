import express from 'express';
import Portfolio from '../models/Portfolio.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';

const router = express.Router();

// Get all portfolio items (public)
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get single portfolio item (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findByPk(id);
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio-Projekt nicht gefunden' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Create portfolio item (protected - Redakteure und Admins)
router.post('/', auth, permissions.portfolio.create, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Titel und Beschreibung sind erforderlich' });
    }
    const portfolio = await Portfolio.create({ ...req.body });
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update portfolio item (protected - Redakteure und Admins)
router.put('/:id', auth, permissions.portfolio.update, async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio-Projekt nicht gefunden' });
    }
    await portfolio.update({ ...req.body });
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Delete portfolio item (protected - nur Admins)
router.delete('/:id', auth, permissions.portfolio.delete, async (req, res) => {
  try {
    const { id } = req.params;
    
    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio-Projekt nicht gefunden' });
    }
    
    await portfolio.destroy();
    res.json({ message: 'Portfolio-Projekt erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

export default router; 