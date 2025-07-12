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
    
    // Daten validieren und bereinigen
    const createData = { ...req.body };
    
    // completionDate validieren - robustere Validierung
    if (createData.completionDate && createData.completionDate !== '') {
      // Prüfe ob es ein gültiges Datum ist
      if (createData.completionDate === 'Invalid date' || createData.completionDate === 'null') {
        createData.completionDate = null;
      } else {
        const date = new Date(createData.completionDate);
        if (isNaN(date.getTime())) {
          createData.completionDate = null;
        } else {
          createData.completionDate = date;
        }
      }
    } else {
      createData.completionDate = null;
    }
    
    // Leere Strings zu null konvertieren für optionale Felder
    if (createData.url === '') createData.url = null;
    if (createData.imageUrl === '') createData.imageUrl = null;
    if (createData.slug === '') createData.slug = null;
    if (createData.client === '') createData.client = null;
    if (createData.content === '') createData.content = null;
    
    // Debug-Ausgabe
    console.log('Cleaned create data:', createData);
    
    const portfolio = await Portfolio.create(createData);
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
    
    // Daten validieren und bereinigen
    const updateData = { ...req.body };
    
    // completionDate validieren - robustere Validierung
    if (updateData.completionDate && updateData.completionDate !== '') {
      // Prüfe ob es ein gültiges Datum ist
      if (updateData.completionDate === 'Invalid date' || updateData.completionDate === 'null') {
        updateData.completionDate = null;
      } else {
        const date = new Date(updateData.completionDate);
        if (isNaN(date.getTime())) {
          updateData.completionDate = null;
        } else {
          updateData.completionDate = date;
        }
      }
    } else {
      updateData.completionDate = null;
    }
    
    // Leere Strings zu null konvertieren für optionale Felder
    if (updateData.url === '') updateData.url = null;
    if (updateData.imageUrl === '') updateData.imageUrl = null;
    if (updateData.slug === '') updateData.slug = null;
    if (updateData.client === '') updateData.client = null;
    if (updateData.content === '') updateData.content = null;
    
    // Debug-Ausgabe
    console.log('Cleaned update data:', updateData);
    
    await portfolio.update(updateData);
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