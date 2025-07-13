import { sequelize } from './db.js';
import User from './User.js';
import Blog from './Blog.js';
import Portfolio from './Portfolio.js';
import Page from './Page.js';
import ContactMessage from './ContactMessage.js';
import Media from './Media.js';
import Menu from './Menu.js';
import MenuItem from './MenuItem.js';
import TeamMember from './TeamMember.js';
import WebsiteSettings from './WebsiteSettings.js';

// Associations
Menu.hasMany(MenuItem, { foreignKey: 'menuId' });
MenuItem.belongsTo(Menu, { foreignKey: 'menuId' });

export {
  sequelize,
  User,
  Blog,
  Portfolio,
  Page,
  ContactMessage,
  Media,
  Menu,
  MenuItem,
  TeamMember,
  WebsiteSettings
}; 