import express from 'express';
import { 
  getAllSettings, 
  getSetting, 
  upsertSetting, 
  deleteSetting, 
  getPublicSettings 
} from '../controllers/websiteSettingsController.js';
import auth from '../middleware/auth.js';
import { requireAdmin } from '../middleware/permissions.js';

const router = express.Router();

// Public routes (for frontend)
router.get('/public', getPublicSettings);

// Protected routes (for admin panel) - Nur Admins
router.get('/', auth, requireAdmin, getAllSettings);
router.get('/:key', auth, requireAdmin, getSetting);
router.post('/', auth, requireAdmin, upsertSetting);
router.put('/:key', auth, requireAdmin, upsertSetting);
router.delete('/:key', auth, requireAdmin, deleteSetting);

export default router; 