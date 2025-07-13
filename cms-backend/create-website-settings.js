import { sequelize } from './models/index.js';
import createDefaultWebsiteSettings from './migrate+create/create-default-website-settings.js';

const createWebsiteSettings = async () => {
  try {
    console.log('Starte Erstellung der Website-Einstellungen...');
    
    // Verbinde zur Datenbank
    await sequelize.authenticate();
    console.log('✓ Datenbankverbindung hergestellt');
    
    // Synchronisiere Modelle
    await sequelize.sync();
    console.log('✓ Modelle synchronisiert');
    
    // Erstelle Standard-Einstellungen
    await createDefaultWebsiteSettings();
    
    console.log('✓ Website-Einstellungen erfolgreich erstellt!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Website-Einstellungen:', error);
    process.exit(1);
  }
};

createWebsiteSettings(); 