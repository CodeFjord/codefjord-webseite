import { TeamMember } from '../models/index.js';

// Alle Team-Mitglieder abrufen (sortiert nach order)
const getAll = async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll({
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });
    
    res.json(teamMembers);
  } catch (error) {
    console.error('Fehler beim Abrufen der Team-Mitglieder:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};

// Einzelnes Team-Mitglied abrufen
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByPk(id);
    
    if (!teamMember) {
      return res.status(404).json({ error: 'Team-Mitglied nicht gefunden' });
    }
    
    res.json(teamMember);
  } catch (error) {
    console.error('Fehler beim Abrufen des Team-Mitglieds:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};

// Neues Team-Mitglied erstellen
const create = async (req, res) => {
  try {
    const { name, role, bio, imageUrl, order } = req.body;
    
    // Validierung
    if (!name || !role) {
      return res.status(400).json({ error: 'Name und Rolle sind erforderlich' });
    }
    
    const teamMember = await TeamMember.create({
      name,
      role,
      bio,
      imageUrl,
      order: order || 0
    });
    
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Fehler beim Erstellen des Team-Mitglieds:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};

// Team-Mitglied aktualisieren
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, imageUrl, order } = req.body;
    
    const teamMember = await TeamMember.findByPk(id);
    
    if (!teamMember) {
      return res.status(404).json({ error: 'Team-Mitglied nicht gefunden' });
    }
    
    // Validierung
    if (!name || !role) {
      return res.status(400).json({ error: 'Name und Rolle sind erforderlich' });
    }
    
    await teamMember.update({
      name,
      role,
      bio,
      imageUrl,
      order: order !== undefined ? order : teamMember.order
    });
    
    res.json(teamMember);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Team-Mitglieds:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};

// Team-Mitglied löschen
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByPk(id);
    
    if (!teamMember) {
      return res.status(404).json({ error: 'Team-Mitglied nicht gefunden' });
    }
    
    await teamMember.destroy();
    
    res.json({ message: 'Team-Mitglied erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Team-Mitglieds:', error);
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
};

export {
  getAll,
  getById,
  create,
  update,
  remove
}; 