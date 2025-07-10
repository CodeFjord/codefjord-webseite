import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db.js';

class Portfolio extends Model {}

Portfolio.init({
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
  category: DataTypes.STRING,
  link: DataTypes.STRING,
  technologies: DataTypes.STRING,
  url: DataTypes.STRING,
  imageUrl: DataTypes.STRING,
  status: DataTypes.STRING,
  slug: DataTypes.STRING,
  client: DataTypes.STRING,
  completionDate: DataTypes.DATE,
  content: DataTypes.TEXT,
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Portfolio',
  timestamps: true
});

export default Portfolio; 