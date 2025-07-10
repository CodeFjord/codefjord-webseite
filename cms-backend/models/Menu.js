import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db.js';

class Menu extends Model {}

Menu.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.ENUM('navbar', 'footer'),
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Menu'
});

// Associations
Menu.associate = (models) => {
  Menu.hasMany(models.MenuItem, {
    foreignKey: 'menuId',
    as: 'items'
  });
};

export default Menu; 