import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/db.js';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import blogRoutes from './routes/blog.js';
import pageRoutes from './routes/pages.js';
import contactRoutes from './routes/contact.js';
import mediaRoutes from './routes/media.js';
import menuRoutes from './routes/menus.js';
import teamMemberRoutes from './routes/teamMembers.js';
import notificationRoutes from './routes/notifications.js';
import appRoutes from './routes/app.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4444;

// CORS für mobile App aktiviert
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS request from origin:', origin);

    const allowedOrigins = [
      // Staging
      'https://staging.code-fjord.de',
      'https://admin-staging.code-fjord.de',
      // Production
      'https://code-fjord.de',
      'https://admin.code-fjord.de',
      // Development
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173',
      // Mobile App (React Native)
      'http://192.168.178.144:4444',
      'http://192.168.178.144:3000',
      'http://192.168.178.144:5173',
      // Erlaube alle lokale IPs für Entwicklung
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/
    ];
    
    // Erlaube requests ohne origin (z.B. mobile Apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Prüfe gegen Regex für lokale IPs
    const isLocalIP = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isLocalIP) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Debug-Middleware für alle Requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

app.use(express.json());

// Statische Auslieferung von Uploads
app.use('/uploads', express.static(path.resolve('uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/app', appRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

app.get('/', (req, res) => res.json({ 
  message: 'CodeFjord CMS Backend läuft!',
  environment: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString()
}));

// Import all models and set up associations
import User from './models/User.js';
import Blog from './models/Blog.js';
import Portfolio from './models/Portfolio.js';
import Page from './models/Page.js';
import ContactMessage from './models/ContactMessage.js';
import Media from './models/Media.js';
import Menu from './models/Menu.js';
import MenuItem from './models/MenuItem.js';
import TeamMember from './models/TeamMember.js';
import Notification from './models/Notification.js';

// Register associations
const models = {
  User,
  Blog,
  Portfolio,
  Page,
  ContactMessage,
  Media,
  Menu,
  MenuItem,
  TeamMember,
  Notification
};

// Call associate function for each model if it exists
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// DB sync und Serverstart
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB verbunden & synchronisiert.');
    app.listen(PORT, () => console.log(`Server läuft auf https://localhost:${PORT}`));
  } catch (err) {
    console.error('DB-Fehler:', err);
    process.exit(1);
  }
})(); 