const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js');
const User = require('./user.model.js');


const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sender: {
    references: {
      model: User,
      key: 'id'
    },
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Message;