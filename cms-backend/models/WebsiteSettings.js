import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const WebsiteSettings = sequelize.define('WebsiteSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'website_settings',
  timestamps: true
});

export default WebsiteSettings; 