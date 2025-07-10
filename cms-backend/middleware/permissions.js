// Berechtigungs-Middleware für rollenbasierte Zugriffskontrolle
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Keine Berechtigung für diese Aktion' });
    }

    next();
  };
};

// Spezielle Berechtigungen für Redakteure (keine Lösch-Operationen)
export const requireEditorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Nicht authentifiziert' });
  }

  // Administratoren haben alle Rechte
  if (req.user.role === 'admin') {
    return next();
  }

  // Redakteure haben eingeschränkte Rechte
  if (req.user.role === 'redakteur') {
    return next();
  }

  return res.status(403).json({ error: 'Keine Berechtigung für diese Aktion' });
};

// Nur Administratoren dürfen löschen
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Nicht authentifiziert' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Nur Administratoren dürfen diese Aktion ausführen' });
  }

  next();
};

// Redakteure und Admins können Kontakt-Nachrichten bearbeiten
export const requireContactAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Nicht authentifiziert' });
  }

  if (['admin', 'redakteur'].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ error: 'Keine Berechtigung für diese Aktion' });
};

// Berechtigungen für verschiedene Bereiche
export const permissions = {
  // Portfolio: Redakteure können anlegen/bearbeiten, nur Admins löschen
  portfolio: {
    create: requireEditorOrAdmin,
    read: requireEditorOrAdmin,
    update: requireEditorOrAdmin,
    delete: requireAdmin
  },
  
  // Blog: Redakteure können anlegen/bearbeiten, nur Admins löschen
  blog: {
    create: requireEditorOrAdmin,
    read: requireEditorOrAdmin,
    update: requireEditorOrAdmin,
    delete: requireAdmin
  },
  
  // Seiten: Redakteure können anlegen/bearbeiten, nur Admins löschen
  pages: {
    create: requireEditorOrAdmin,
    read: requireEditorOrAdmin,
    update: requireEditorOrAdmin,
    delete: requireAdmin
  },
  
  // Team: Redakteure können anlegen/bearbeiten, nur Admins löschen
  team: {
    create: requireEditorOrAdmin,
    read: requireEditorOrAdmin,
    update: requireEditorOrAdmin,
    delete: requireAdmin
  },
  
  // Media: Redakteure können anlegen/bearbeiten, nur Admins löschen
  media: {
    create: requireEditorOrAdmin,
    read: requireEditorOrAdmin,
    update: requireEditorOrAdmin,
    delete: requireAdmin
  },
  
  // Menüs: Nur Administratoren
  menus: {
    create: requireAdmin,
    read: requireAdmin,
    update: requireAdmin,
    delete: requireAdmin
  },
  
  // Benutzer: Nur Administratoren
  users: {
    create: requireAdmin,
    read: requireAdmin,
    update: requireAdmin,
    delete: requireAdmin
  },
  
  // Kontakt: Redakteure können lesen/bearbeiten/antworten, nur Admins löschen
  contact: {
    create: requireAdmin, // Öffentlich für Kontaktformular
    read: requireContactAccess,
    update: requireContactAccess,
    reply: requireContactAccess,
    delete: requireAdmin
  },
  
  // Benachrichtigungen: Redakteure können lesen, nur Admins erstellen/löschen
  notifications: {
    create: requireAdmin,
    read: requireEditorOrAdmin,
    update: requireAdmin,
    delete: requireAdmin
  }
}; 