import Notification from '../models/Notification.js';
import { Op } from 'sequelize';

// Alle Benachrichtigungen abrufen
export const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (unreadOnly === 'true') {
      whereClause.read = false;
    }

    // Abgelaufene Benachrichtigungen ausschließen
    whereClause[Op.or] = [
      { expiresAt: null },
      { expiresAt: { [Op.gt]: new Date() } }
    ];

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      notifications: notifications.rows,
      total: notifications.count,
      page: parseInt(page),
      totalPages: Math.ceil(notifications.count / limit)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
};

// Ungelesene Benachrichtigungen zählen
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        read: false,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: new Date() } }
        ]
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
};

// Benachrichtigung als gelesen markieren
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Benachrichtigung nicht gefunden' });
    }

    await notification.update({ read: true });
    res.json({ message: 'Benachrichtigung als gelesen markiert' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
};

// Alle Benachrichtigungen als gelesen markieren
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      {
        where: {
          read: false,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        }
      }
    );

    res.json({ message: 'Alle Benachrichtigungen als gelesen markiert' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
};

// Benachrichtigung löschen
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Benachrichtigung nicht gefunden' });
    }

    await notification.destroy();
    res.json({ message: 'Benachrichtigung gelöscht' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
};

// Benachrichtigung erstellen (für interne Verwendung)
export const createNotification = async (type, title, message, data = null, priority = 'normal', expiresAt = null) => {
  try {
    const notification = await Notification.create({
      type,
      title,
      message,
      data,
      priority,
      expiresAt
    });

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Abgelaufene Benachrichtigungen bereinigen
export const cleanupExpiredNotifications = async () => {
  try {
    const deletedCount = await Notification.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });

    console.log(`Bereinigt: ${deletedCount} abgelaufene Benachrichtigungen gelöscht`);
    return deletedCount;
  } catch (error) {
    console.error('Cleanup expired notifications error:', error);
    throw error;
  }
}; 