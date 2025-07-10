import express from 'express';
import * as ctrl from '../controllers/contactController.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';

const router = express.Router();

// Öffentliche Route für das Kontaktformular
router.post('/', ctrl.create);

// Geschützte Routen - Redakteure und Admins können lesen/bearbeiten
router.get('/', auth, permissions.contact.read, ctrl.getAll);
router.get('/:id', auth, permissions.contact.read, ctrl.getOne);
router.patch('/:id', auth, permissions.contact.update, ctrl.update);
router.post('/reply/:id', auth, permissions.contact.reply, ctrl.reply);

// Nur Admins können löschen
router.delete('/:id', auth, permissions.contact.delete, ctrl.remove);

export default router; 