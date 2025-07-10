import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db.js';

class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['contact', 'blog', 'portfolio', 'user', 'system']]
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Zusätzliche Daten für die Benachrichtigung (z.B. Entity ID)'
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'normal',
    validate: {
      isIn: [['low', 'normal', 'high', 'urgent']]
    }
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Datum, an dem die Benachrichtigung automatisch gelöscht wird'
  }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'Notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['read']
    },
    {
      fields: ['createdAt']
    }
  ]
});

export default Notification; 