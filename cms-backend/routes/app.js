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
      qrCodeUrl: process.env.APP_QR_CODE_URL || 'https://cdn.code-fjord.de/apps/qr-code.png',
      manifestUrl: process.env.APP_MANIFEST_URL || 'https://cdn.code-fjord.de/app/manifest.plist',
      installUrl: `itms-services://?action=download-manifest&url=${encodeURIComponent(process.env.APP_MANIFEST_URL || 'https://cdn.code-fjord.de/apps/manifest.plist')}`,
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

// Manifest.plist für Ad-Hoc-Distribution (öffentlich zugänglich)
router.get('/manifest.plist', async (req, res) => {
  try {
    const manifest = {
      items: [{
        assets: [{
          kind: 'software-package',
          url: process.env.APP_DOWNLOAD_URL || 'https://your-domain.com/apps/CodeFjordAdmin.ipa'
        }, {
          kind: 'display-image',
          url: process.env.APP_DISPLAY_IMAGE_URL || 'https://your-domain.com/apps/icon-57.png',
          'needs-shine': false
        }, {
          kind: 'full-size-image',
          url: process.env.APP_FULL_SIZE_IMAGE_URL || 'https://your-domain.com/apps/icon-512.png',
          'needs-shine': false
        }],
        metadata: {
          'bundle-identifier': process.env.APP_BUNDLE_ID || 'com.codefjord.admin',
          'bundle-version': process.env.APP_VERSION || '1.0.0',
          kind: 'software',
          title: process.env.APP_TITLE || 'CodeFjord Admin'
        }
      }]
    };

    res.setHeader('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>${manifest.items[0].assets[0].url}</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>url</key>
                    <string>${manifest.items[0].assets[1].url}</string>
                    <key>needs-shine</key>
                    <false/>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>full-size-image</string>
                    <key>url</key>
                    <string>${manifest.items[0].assets[2].url}</string>
                    <key>needs-shine</key>
                    <false/>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>${manifest.items[0].metadata['bundle-identifier']}</string>
                <key>bundle-version</key>
                <string>${manifest.items[0].metadata['bundle-version']}</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string>${manifest.items[0].metadata.title}</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`);
  } catch (error) {
    console.error('Manifest generation error:', error);
    res.status(500).json({ error: 'Fehler beim Generieren des Manifests.' });
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

// Admin-Status prüfen (öffentlich zugänglich)
router.get('/admin-status', async (req, res) => {
  try {
    console.log('Admin status check request headers:', req.headers);
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Extracted token:', token ? 'exists' : 'not found');
    
    if (!token) {
      console.log('No token provided, returning isAdmin: false');
      return res.json({ isAdmin: false });
    }

    // Token validieren
    const jwt = await import('jsonwebtoken');
    const { User } = await import('../models/index.js');
    
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    const user = await User.findByPk(decoded.userId);
    console.log('User found:', user ? { id: user.id, email: user.email, role: user.role } : 'not found');
    
    if (!user || user.role !== 'admin') {
      console.log('User not found or not admin, returning isAdmin: false');
      return res.json({ isAdmin: false });
    }

    console.log('User is admin, returning isAdmin: true');
    res.json({ isAdmin: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Admin status check error:', error);
    res.json({ isAdmin: false });
  }
});

export default router; 