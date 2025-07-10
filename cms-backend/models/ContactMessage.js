import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db.js';

class ContactMessage extends Model {}

ContactMessage.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Kontaktanfrage'
  },
  message: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('neu', 'gelesen', 'beantwortet'),
    defaultValue: 'neu',
    allowNull: false
  },
  adminReply: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ContactMessage'
});

export default ContactMessage; 