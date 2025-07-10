# CodeFjord Webseite

Eine moderne, vollständige Webseiten-Lösung mit CMS-Backend, Admin-Panel und Frontend. Das Projekt besteht aus drei Hauptkomponenten: einem Node.js/Express Backend mit MariaDB, einem React-basierten Admin-Panel und einer React-Frontend-Webseite.

## 🏗️ Projektarchitektur

```
CodeFjord Webseite/
├── cms-backend/          # Node.js/Express API mit MariaDB
├── admin-panel/          # React Admin-Panel (Material-UI)
├── frontend/             # React Frontend-Webseite
└── deployment.sh         # Deployment-Skript
```

## 🚀 Technologie-Stack

### Backend (cms-backend)

- **Runtime**: Node.js mit ES Modules
- **Framework**: Express.js
- **Datenbank**: MariaDB mit Sequelize ORM
- **Authentifizierung**: JWT mit bcrypt
- **Datei-Upload**: Multer
- **E-Mail**: Nodemailer
- **Validierung**: Express-validator

### Admin-Panel (admin-panel)

- **Framework**: React 19 mit Vite
- **UI-Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Emotion

### Frontend (frontend)

- **Framework**: React 19 mit Vite
- **UI Components**: Headless UI + Heroicons
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## 📋 Voraussetzungen

- Node.js (Version 18 oder höher)
- MariaDB/MySQL Server
- Git
- npm oder yarn

## 🛠️ Installation & Setup

### 1. Repository klonen

```bash
git clone <repository-url>
cd Webseite
```

### 2. Backend Setup

```bash
cd cms-backend
npm install
```

**Umgebungsvariablen konfigurieren:**
Erstelle eine `.env` Datei im `cms-backend` Verzeichnis:

```env
# Server
PORT=4444
NODE_ENV=development

# Datenbank
DB_HOST=localhost
DB_PORT=3306
DB_NAME=codefjord_cms
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# E-Mail (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Datenbank einrichten:**

```bash
# MariaDB/MySQL Datenbank erstellen
mysql -u root -p
CREATE DATABASE codefjord_cms;
```

### 3. Admin-Panel Setup

```bash
cd admin-panel
npm install
```

**API-URL konfigurieren:**
Bearbeite `src/api/client.js` und setze die korrekte Backend-URL.

### 4. Frontend Setup

```bash
cd frontend
npm install
```

**API-URL konfigurieren:**
Bearbeite `src/api/cms.js` und setze die korrekte Backend-URL.

## 🚀 Entwicklung starten

### Backend starten

```bash
cd cms-backend
npm start
```

Backend läuft auf: http://localhost:4444

### Admin-Panel starten

```bash
cd admin-panel
npm run dev
```

Admin-Panel läuft auf: http://localhost:5173

### Frontend starten

```bash
cd frontend
npm run dev
```

Frontend läuft auf: http://localhost:5174

## 📊 Datenbank-Migrationen

Das Backend enthält verschiedene Migrationsskripte für die Datenbank:

```bash
cd cms-backend

# Blog-Migration
npm run migrate-blog

# Portfolio-Migration
npm run migrate-portfolio

# Weitere verfügbare Skripte:
node create-default-menus.js
node create-default-pages.js
node create-default-team-members.js
node create-sample-notifications.js
```

## 🔐 Authentifizierung & Berechtigungen

### Benutzerrollen

- **Admin**: Vollzugriff auf alle Funktionen
- **Editor**: Kann Inhalte bearbeiten, aber keine Benutzer verwalten
- **Author**: Kann eigene Inhalte erstellen und bearbeiten

### JWT-Token

- Standard-Ablaufzeit: 24 Stunden
- Automatische Verlängerung bei Aktivität
- Sichere Speicherung im Browser

## 📁 API-Endpunkte

### Authentifizierung

- `POST /api/auth/login` - Benutzer anmelden
- `POST /api/auth/register` - Benutzer registrieren
- `GET /api/auth/me` - Aktueller Benutzer

### Inhaltsverwaltung

- `GET/POST/PUT/DELETE /api/blog` - Blog-Artikel
- `GET/POST/PUT/DELETE /api/portfolio` - Portfolio-Projekte
- `GET/POST/PUT/DELETE /api/pages` - Statische Seiten
- `GET/POST/PUT/DELETE /api/team-members` - Team-Mitglieder
- `GET/POST/PUT/DELETE /api/menus` - Navigation
- `GET/POST/PUT/DELETE /api/media` - Medien-Uploads

### Kontakt & Benachrichtigungen

- `POST /api/contact` - Kontaktformular
- `GET/POST/PUT/DELETE /api/notifications` - System-Benachrichtigungen

## 🎨 Frontend-Features

### Responsive Design

- Mobile-first Ansatz
- Optimiert für alle Bildschirmgrößen
- Moderne UI/UX mit Framer Motion Animationen

### SEO-Optimierung

- Meta-Tags für alle Seiten
- Strukturierte Daten
- Sitemap-Unterstützung

### Performance

- Lazy Loading für Bilder
- Code-Splitting
- Optimierte Builds mit Vite

## 🔧 Admin-Panel Features

### Dashboard

- Übersicht über alle Inhalte
- Statistiken und Metriken
- Schnellzugriff auf wichtige Funktionen

### Inhaltsverwaltung

- WYSIWYG-Editor für Blog und Seiten
- Drag & Drop für Medien-Uploads
- Vorschau-Funktion

### Benutzerverwaltung

- Rollenbasierte Berechtigungen
- Benutzerprofile verwalten
- Aktivitätsprotokoll

## 🚀 Deployment

### Automatisches CI/CD mit GitHub Actions

Das Projekt verwendet GitHub Actions für automatische Deployments:

#### 🚀 Staging-Deployment

- **Trigger**: Push auf `develop` Branch
- **Workflow**: `.github/workflows/deploy-staging.yml`
- **Umgebung**: Staging-Server
- **URLs**:
  - Frontend: https://staging.code-fjord.de
  - Admin Panel: https://admin-staging.code-fjord.de

#### 🚀 Production-Deployment

- **Trigger**: Push auf `main` Branch
- **Workflow**: `.github/workflows/deploy-production.yml`
- **Umgebung**: Produktions-Server
  - **Features**:
    - Automatische Tests
    - Production Build
    - GitHub Release erstellen
    - Discord & E-Mail Benachrichtigungen
- **URLs**:
  - Frontend: https://code-fjord.de
  - Admin Panel: https://admin.code-fjord.de

#### 🔧 GitHub Secrets Setup

Alle erforderlichen Secrets sind in `.github/SECRETS.md` dokumentiert.

### Manuelles Deployment

**Backend:**

```bash
cd cms-backend
npm install --production
cp .env.production .env
npm start
```

**Frontend:**

```bash
cd frontend
npm install
npm run build
# Dist-Ordner auf Webserver kopieren
```

**Admin-Panel:**

```bash
cd admin-panel
npm install
npm run build
# Dist-Ordner auf Webserver kopieren
```

## 🧪 Testing

### Backend Tests

```bash
cd cms-backend
# Tests implementieren mit Jest
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### E2E Tests

```bash
# Cypress für End-to-End Tests
npm run cypress:open
```

## 📝 Entwicklung

### Code-Stil

- ESLint für JavaScript/React
- Prettier für Code-Formatierung
- Konsistente Namenskonventionen

### Git Workflow

- Feature-Branches für neue Funktionen
- Pull Requests für Code-Reviews
- Semantic Versioning

### Debugging

- Backend: Node.js Debugger
- Frontend: React DevTools
- API: Postman/Insomnia

## 🔒 Sicherheit

### Implementierte Maßnahmen

- JWT-basierte Authentifizierung
- Passwort-Hashing mit bcrypt
- CORS-Konfiguration
- Input-Validierung
- SQL-Injection-Schutz durch Sequelize

### Empfohlene Maßnahmen

- HTTPS in Produktion
- Rate Limiting
- Helmet.js für Express
- Regelmäßige Security-Updates

## 📞 Support & Wartung

### Logs

- Backend-Logs: `cms-backend/backend.log`
- Error-Logs: `error.log` (Deployment)

### Monitoring

- Server-Status über API-Endpunkt
- Datenbank-Verbindungsüberwachung
- Performance-Metriken

### Backup

- Regelmäßige Datenbank-Backups
- Code-Versionierung über Git
- Umgebungsvariablen dokumentieren

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Implementiere deine Änderungen
4. Schreibe Tests
5. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt ist proprietär und gehört zu CodeFjord.

## 👥 Team

- **Entwicklung**: CodeFjord Development Team
- **Design**: CodeFjord Design Team
- **Projektleitung**: CodeFjord Management

---

**Letzte Aktualisierung**: Dezember 2024
**Version**: 1.0.0
