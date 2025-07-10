import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db.js';

class Media extends Model {}

Media.init({
  filename: DataTypes.STRING,
  url: DataTypes.STRING,
  mimetype: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Media'
});

export default Media; 