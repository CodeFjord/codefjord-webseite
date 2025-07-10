import express from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { permissions } from '../middleware/permissions.js';
import {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications (protected - Redakteure und Admins können lesen)
router.get('/', auth, permissions.notifications.read, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get single notification (protected - Redakteure und Admins können lesen)
router.get('/:id', auth, permissions.notifications.read, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Benachrichtigung nicht gefunden' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Create notification (protected - nur Admins)
router.post('/', auth, permissions.notifications.create, async (req, res) => {
  try {
    const { title, message, type, read } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Titel und Nachricht sind erforderlich' });
    }
    const notification = await Notification.create({ ...req.body });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update notification (protected - nur Admins)
router.put('/:id', auth, permissions.notifications.update, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Benachrichtigung nicht gefunden' });
    }
    await notification.update({ ...req.body });
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Delete notification (protected - nur Admins)
router.delete('/:id', auth, permissions.notifications.delete, async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Benachrichtigung nicht gefunden' });
    }
    
    await notification.destroy();
    res.json({ message: 'Benachrichtigung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Ungelesene Benachrichtigungen zählen (Redakteure und Admins)
router.get('/unread/count', auth, permissions.notifications.read, async (req, res) => {
  try {
    const count = await Notification.count({
      where: { read: false }
    });
    res.json({ count });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Benachrichtigung als gelesen markieren (Redakteure und Admins)
router.patch('/:id/read', auth, permissions.notifications.read, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Benachrichtigung nicht gefunden' });
    }
    
    await notification.update({ read: true });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

export default router; 