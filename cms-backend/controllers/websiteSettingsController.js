import { WebsiteSettings } from '../models/index.js';

// Get all website settings
export const getAllSettings = async (req, res) => {
  try {
    const settings = await WebsiteSettings.findAll();
    const settingsObject = {};
    
    settings.forEach(setting => {
      settingsObject[setting.key] = {
        value: setting.value,
        description: setting.description
      };
    });
    
    res.json(settingsObject);
  } catch (error) {
    console.error('Error fetching website settings:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Website-Einstellungen' });
  }
};

// Get single setting by key
export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await WebsiteSettings.findOne({ where: { key } });
    
    if (!setting) {
      return res.status(404).json({ error: 'Einstellung nicht gefunden' });
    }
    
    res.json({
      key: setting.key,
      value: setting.value,
      description: setting.description
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Einstellung' });
  }
};

// Create or update setting
export const upsertSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key und Value sind erforderlich' });
    }
    
    const [setting, created] = await WebsiteSettings.upsert({
      key,
      value: String(value),
      description
    });
    
    res.json({
      key: setting.key,
      value: setting.value,
      description: setting.description,
      created
    });
  } catch (error) {
    console.error('Error upserting setting:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Einstellung' });
  }
};

// Delete setting
export const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const deleted = await WebsiteSettings.destroy({ where: { key } });
    
    if (deleted === 0) {
      return res.status(404).json({ error: 'Einstellung nicht gefunden' });
    }
    
    res.json({ message: 'Einstellung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Einstellung' });
  }
};

// Get public settings (for frontend)
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await WebsiteSettings.findAll({
      where: {
        key: [
          'coming_soon_enabled', 
          'coming_soon_date', 
          'coming_soon_title',
          'coming_soon_message',
          'maintenance_enabled', 
          'maintenance_message'
        ]
      }
    });
    
    const publicSettings = {};
    settings.forEach(setting => {
      publicSettings[setting.key] = setting.value;
    });
    
    res.json(publicSettings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der öffentlichen Einstellungen' });
  }
}; 