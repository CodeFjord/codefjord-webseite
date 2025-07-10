import Menu from '../models/Menu.js';
import MenuItem from '../models/MenuItem.js';

// Get all menus (admin)
export const getAll = async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: [{
        model: MenuItem,
        as: 'items',
        where: { parentId: null }, // Nur Top-Level Items
        required: false,
        include: [{
          model: MenuItem,
          as: 'children'
        }]
      }],
      order: [
        ['id', 'ASC'],
        [{ model: MenuItem, as: 'items' }, 'order', 'ASC'],
        [{ model: MenuItem, as: 'items' }, { model: MenuItem, as: 'children' }, 'order', 'ASC']
      ]
    });
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Menüs.' });
  }
};

// Get menu by location (public)
export const getByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const menu = await Menu.findOne({
      where: { 
        location,
        active: true 
      },
      include: [{
        model: MenuItem,
        as: 'items',
        where: { 
          parentId: null,
          active: true 
        },
        required: false,
        include: [{
          model: MenuItem,
          as: 'children',
          where: { active: true },
          required: false
        }]
      }],
      order: [
        [{ model: MenuItem, as: 'items' }, 'order', 'ASC'],
        [{ model: MenuItem, as: 'items' }, { model: MenuItem, as: 'children' }, 'order', 'ASC']
      ]
    });
    
    if (!menu) {
      return res.status(404).json({ error: 'Menü nicht gefunden.' });
    }
    
    res.json(menu);
  } catch (err) {
    console.error('Error fetching menu by location:', err);
    res.status(500).json({ error: 'Fehler beim Laden des Menüs.' });
  }
};

// Get single menu (admin)
export const getOne = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id, {
      include: [{
        model: MenuItem,
        as: 'items',
        where: { parentId: null },
        required: false,
        include: [{
          model: MenuItem,
          as: 'children'
        }]
      }],
      order: [
        [{ model: MenuItem, as: 'items' }, 'order', 'ASC'],
        [{ model: MenuItem, as: 'items' }, { model: MenuItem, as: 'children' }, 'order', 'ASC']
      ]
    });
    
    if (!menu) {
      return res.status(404).json({ error: 'Menü nicht gefunden.' });
    }
    
    res.json(menu);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Fehler beim Laden des Menüs.' });
  }
};

// Create menu (admin)
export const create = async (req, res) => {
  try {
    const { name, location, active } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ error: 'Name und Location sind erforderlich.' });
    }
    
    const menu = await Menu.create({
      name,
      location,
      active: active !== undefined ? active : true
    });
    
    res.status(201).json(menu);
  } catch (err) {
    console.error('Error creating menu:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen des Menüs.' });
  }
};

// Update menu (admin)
export const update = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menü nicht gefunden.' });
    }
    
    const { name, location, active } = req.body;
    await menu.update({
      name: name || menu.name,
      location: location || menu.location,
      active: active !== undefined ? active : menu.active
    });
    
    res.json(menu);
  } catch (err) {
    console.error('Error updating menu:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Menüs.' });
  }
};

// Delete menu (admin)
export const remove = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menü nicht gefunden.' });
    }
    
    // Lösche alle zugehörigen MenuItems
    await MenuItem.destroy({ where: { menuId: menu.id } });
    
    // Lösche das Menü
    await menu.destroy();
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Menüs.' });
  }
}; 