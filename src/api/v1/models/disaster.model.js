const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./user.model.js');

const Disaster = sequelize.define('Disaster', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING, // URL to the photo
  },
  video: {
    type: DataTypes.STRING, // URL to the video
  },
  informerId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
  }
});

// Set up the association
User.hasMany(Disaster, { foreignKey: 'informerId' });
Disaster.belongsTo(User, { foreignKey: 'informerId' });

module.exports = Disaster;
