// Frontend-Berechtigungs-Utilities
export const canDelete = (userRole) => {
  return userRole === 'admin';
};

export const canManageUsers = (userRole) => {
  return userRole === 'admin';
};

export const canManageMenus = (userRole) => {
  return userRole === 'admin';
};

export const canCreateNotifications = (userRole) => {
  return userRole === 'admin';
};

export const canDeleteNotifications = (userRole) => {
  return userRole === 'admin';
};

export const canAccessContact = (userRole) => {
  return ['admin', 'redakteur'].includes(userRole);
};

export const canAccessNotifications = (userRole) => {
  return ['admin', 'redakteur'].includes(userRole);
};

// Allgemeine Berechtigungsprüfung
export const hasPermission = (userRole, permission) => {
  const permissions = {
    delete: canDelete,
    manageUsers: canManageUsers,
    manageMenus: canManageMenus,
    createNotifications: canCreateNotifications,
    deleteNotifications: canDeleteNotifications,
    accessContact: canAccessContact,
    accessNotifications: canAccessNotifications
  };

  const checkPermission = permissions[permission];
  return checkPermission ? checkPermission(userRole) : false;
}; 