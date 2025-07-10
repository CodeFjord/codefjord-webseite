import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db.js';

class Page extends Model {}

Page.init({
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  content: DataTypes.TEXT,
  metaTitle: DataTypes.STRING,
  metaDescription: DataTypes.STRING,
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Page'
});

export default Page; 