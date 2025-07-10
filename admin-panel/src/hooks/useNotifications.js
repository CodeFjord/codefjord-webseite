import { useState, useEffect, useCallback } from 'react';
import { notificationsAPI } from '../api/client';
import useAuth from '../store/auth';

const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prüfe ob Benutzer Zugriff auf Benachrichtigungen hat
  const hasNotificationAccess = ['admin', 'redakteur'].includes(user?.role);

  // Benachrichtigungen laden
  const loadNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationsAPI.getAll(params);
      setNotifications(response.data.notifications || []);
    } catch (err) {
      // Ignoriere 403-Fehler (keine Berechtigung)
      if (err.response?.status === 403) {
        setNotifications([]);
        return;
      }
      setError(err.response?.data?.error || 'Fehler beim Laden der Benachrichtigungen');
      console.error('Load notifications error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ungelesene Anzahl laden
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.count || 0);
    } catch (err) {
      // Ignoriere 403-Fehler (keine Berechtigung)
      if (err.response?.status === 403) {
        setUnreadCount(0);
        return;
      }
      console.error('Load unread count error:', err);
    }
  }, []);

  // Als gelesen markieren
  const markAsRead = useCallback(async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      
      // Lokalen State aktualisieren
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Ungelesene Anzahl aktualisieren
      loadUnreadCount();
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }, [loadUnreadCount]);

  // Alle als gelesen markieren
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead();
      
      // Lokalen State aktualisieren
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Ungelesene Anzahl zurücksetzen
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  }, []);

  // Benachrichtigung löschen
  const deleteNotification = useCallback(async (id) => {
    try {
      await notificationsAPI.delete(id);
      
      // Lokalen State aktualisieren
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
      
      // Ungelesene Anzahl aktualisieren
      loadUnreadCount();
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  }, [loadUnreadCount]);

  // Benachrichtigungen formatieren
  const formatNotification = useCallback((notification) => {
    const now = new Date();
    const createdAt = new Date(notification.createdAt);
    const diffInMinutes = Math.floor((now - createdAt) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    let timeAgo;
    if (diffInMinutes < 1) {
      timeAgo = 'Gerade eben';
    } else if (diffInMinutes < 60) {
      timeAgo = `Vor ${diffInMinutes} ${diffInMinutes === 1 ? 'Minute' : 'Minuten'}`;
    } else if (diffInHours < 24) {
      timeAgo = `Vor ${diffInHours} ${diffInHours === 1 ? 'Stunde' : 'Stunden'}`;
    } else {
      timeAgo = `Vor ${diffInDays} ${diffInDays === 1 ? 'Tag' : 'Tagen'}`;
    }

    return {
      ...notification,
      timeAgo
    };
  }, []);

  // Initiales laden
  useEffect(() => {
    if (hasNotificationAccess) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [loadNotifications, loadUnreadCount, hasNotificationAccess]);

  // Automatisches Neuladen alle 30 Sekunden
  useEffect(() => {
    if (!hasNotificationAccess) return;
    
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadUnreadCount, hasNotificationAccess]);

  return {
    notifications: notifications.map(formatNotification),
    unreadCount,
    loading,
    error,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export default useNotifications; 