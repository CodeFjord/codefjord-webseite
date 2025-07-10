import express from 'express';
import TeamMember from '../models/TeamMember.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';

const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get single team member (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByPk(id);
    
    if (!teamMember) {
      return res.status(404).json({ error: 'Team-Mitglied nicht gefunden' });
    }
    
    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Create team member (protected - Redakteure und Admins)
router.post('/', auth, permissions.team.create, async (req, res) => {
  try {
    const { name, position, bio, image } = req.body;
    if (!name || !position) {
      return res.status(400).json({ error: 'Name und Position sind erforderlich' });
    }
    const teamMember = await TeamMember.create({ ...req.body });
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update team member (protected - Redakteure und Admins)
router.put('/:id', auth, permissions.team.update, async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByPk(id);
    if (!teamMember) {
      return res.status(404).json({ error: 'Team-Mitglied nicht gefunden' });
    }
    await teamMember.update({ ...req.body });
    res.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Delete team member (protected - nur Admins)
router.delete('/:id', auth, permissions.team.delete, async (req, res) => {
  try {
    const { id } = req.params;
    
    const teamMember = await TeamMember.findByPk(id);
    if (!teamMember) {
      return res.status(404).json({ error: 'Team-Mitglied nicht gefunden' });
    }
    
    await teamMember.destroy();
    res.json({ message: 'Team-Mitglied erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

export default router; 