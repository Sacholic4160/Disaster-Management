const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js');
const User = require('./user.model.js');


const Message = sequelize.define('Message', {
  id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true
  },
  text: DataTypes.STRING,
  mediaUrl: DataTypes.STRING,  // URL for photos, videos
  senderId: {
      type: DataTypes.UUID,
      references: {
          model: 'Users',
          key: 'id'
      }
  },
  channelId: {
      type: DataTypes.UUID,
      references: {
          model: 'Channels',
          key: 'id'
      }
  }
});


module.exports = Message;