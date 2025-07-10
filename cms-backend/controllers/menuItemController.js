import MenuItem from '../models/MenuItem.js';

// Get all menu items for a menu (admin)
export const getByMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const items = await MenuItem.findAll({
      where: { menuId },
      order: [['order', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Menüpunkte.' });
  }
};

// Get single menu item (admin)
export const getOne = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menüpunkt nicht gefunden.' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Fehler beim Laden des Menüpunkts.' });
  }
};

// Create menu item (admin)
export const create = async (req, res) => {
  try {
    const { menuId, label, url, target, order, active, parentId } = req.body;
    
    if (!menuId || !label || !url) {
      return res.status(400).json({ error: 'MenuId, Label und URL sind erforderlich.' });
    }
    
    const item = await MenuItem.create({
      menuId,
      label,
      url,
      target: target || '_self',
      order: order || 0,
      active: active !== undefined ? active : true,
      parentId: parentId || null
    });
    
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen des Menüpunkts.' });
  }
};

// Update menu item (admin)
export const update = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menüpunkt nicht gefunden.' });
    }
    
    const { label, url, target, order, active, parentId } = req.body;
    await item.update({
      label: label || item.label,
      url: url || item.url,
      target: target || item.target,
      order: order !== undefined ? order : item.order,
      active: active !== undefined ? active : item.active,
      parentId: parentId !== undefined ? parentId : item.parentId
    });
    
    res.json(item);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Menüpunkts.' });
  }
};

// Delete menu item (admin)
export const remove = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menüpunkt nicht gefunden.' });
    }
    
    // Lösche alle Kind-Elemente
    await MenuItem.destroy({ where: { parentId: item.id } });
    
    // Lösche das Element selbst
    await item.destroy();
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Menüpunkts.' });
  }
};

// Reorder menu items (admin)
export const reorder = async (req, res) => {
  try {
    const { items } = req.body; // Array von { id, order, parentId }
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items-Array ist erforderlich.' });
    }
    
    // Update alle Items mit neuen Reihenfolgen
    for (const item of items) {
      await MenuItem.update(
        { 
          order: item.order,
          parentId: item.parentId || null
        },
        { where: { id: item.id } }
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error reordering menu items:', err);
    res.status(500).json({ error: 'Fehler beim Neuordnen der Menüpunkte.' });
  }
}; 