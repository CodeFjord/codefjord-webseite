import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db.js';

class MenuItem extends Model {}

MenuItem.init({
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Menus',
      key: 'id'
    }
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target: {
    type: DataTypes.ENUM('_self', '_blank'),
    defaultValue: '_self',
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'MenuItems',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'MenuItem'
});

// Associations
MenuItem.associate = (models) => {
  MenuItem.belongsTo(models.Menu, {
    foreignKey: 'menuId',
    as: 'menu'
  });
  
  MenuItem.belongsTo(models.MenuItem, {
    foreignKey: 'parentId',
    as: 'parent'
  });
  
  MenuItem.hasMany(models.MenuItem, {
    foreignKey: 'parentId',
    as: 'children'
  });
};

export default MenuItem; 