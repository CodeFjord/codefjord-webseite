import express from 'express';
import Menu from '../models/Menu.js';
import MenuItem from '../models/MenuItem.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';
import * as menuController from '../controllers/menuController.js';
import * as menuItemController from '../controllers/menuItemController.js';

const router = express.Router();

// Public routes (for frontend)
router.get('/location/:location', menuController.getByLocation);

// Protected routes (admin only)
router.get('/', auth, menuController.getAll);
router.get('/:id', auth, menuController.getOne);
router.post('/', auth, permissions.menus.create, menuController.create);
router.put('/:id', auth, permissions.menus.update, menuController.update);
router.delete('/:id', auth, permissions.menus.delete, menuController.remove);

// Menu items routes
router.get('/:menuId/items', auth, menuItemController.getByMenu);
router.post('/:menuId/items', auth, menuItemController.create);
router.put('/items/:id', auth, menuItemController.update);
router.delete('/items/:id', auth, menuItemController.remove);
router.post('/items/reorder', auth, menuItemController.reorder);

export default router; 