import express from 'express';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';

const router = express.Router();

// App-Download-Informationen abrufen (nur für Admins)
router.get('/download-info', auth, permissions.users.read, async (req, res) => {
  try {
    // App-Download-Konfiguration
    const appInfo = {
      name: 'CodeFjord Admin',
      version: '1.0.0',
      buildNumber: '1',
      platform: 'iOS',
      downloadUrl: process.env.APP_DOWNLOAD_URL || 'https://cdn.code-fjord.de/apps/CodeFjordAdmin.ipa',
      qrCodeUrl: process.env.APP_QR_CODE_URL || 'https://your-domain.com/apps/qr-code.png',
      installInstructions: [
        '1. Tippen Sie auf den Download-Link oder scannen Sie den QR-Code',
        '2. Wählen Sie "Installieren" aus',
        '3. Gehen Sie zu Einstellungen → Allgemein → VPN & Geräteverwaltung',
        '4. Vertrauen Sie dem Entwickler "CodeFjord UG"',
        '5. Die App ist jetzt verfügbar auf Ihrem Home-Screen'
      ],
      requirements: {
        iosVersion: '14.0+',
        deviceTypes: ['iPhone', 'iPad'],
        storage: '50 MB'
      },
      features: [
        'Dashboard mit Echtzeit-Daten',
        'Blog-Verwaltung',
        'Portfolio-Management',
        'Seiten-Editor',
        'Team-Mitglieder-Verwaltung',
        'Medien-Bibliothek',
        'Kontakt-Nachrichten',
        'Dark/Light Mode',
        'Offline-Funktionalität'
      ],
      lastUpdated: new Date().toISOString(),
      developer: 'CodeFjord UG (haftungsbeschränkt) i.G.',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@codefjord.de'
    };

    res.json(appInfo);
  } catch (error) {
    console.error('App download info error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der App-Informationen.' });
  }
});

// App-Download-Statistiken abrufen (nur für Admins)
router.get('/download-stats', auth, permissions.users.read, async (req, res) => {
  try {
    // Hier könnten echte Download-Statistiken aus einer Datenbank kommen
    const stats = {
      totalDownloads: 0,
      downloadsThisMonth: 0,
      downloadsThisWeek: 0,
      activeUsers: 0,
      lastDownload: null,
      deviceTypes: {
        iPhone: 0,
        iPad: 0
      },
      iosVersions: {
        'iOS 14': 0,
        'iOS 15': 0,
        'iOS 16': 0,
        'iOS 17': 0
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('App download stats error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Download-Statistiken.' });
  }
});

export default router; 