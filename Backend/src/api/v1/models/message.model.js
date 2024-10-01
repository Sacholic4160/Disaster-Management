const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./user.model.js');
const Channel = require('./channel.model.js');
const Group = require('./group.model.js'); // Assuming you have a Group model

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: DataTypes.STRING,
  mediaUrl: DataTypes.STRING,  // URL for photos, videos
  senderId: {
    type: DataTypes.UUID,
    references: {
      model: 'User',
      key: 'id',
    },
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.UUID,
    references: {
      model: 'User',
      key: 'id',
    },
    allowNull: true,  // This can be null if it's a group message
  },
  groupId: {
    type: DataTypes.UUID,
    references: {
      model: 'Group', // Ensure this matches your Group model table name
      key: 'id',
    },
    allowNull: true, // This will be null for direct messages
  },
  channelId: {
    type: DataTypes.UUID,
    references: {
      model: 'Channel', // Ensure this matches your Channel model table name
      key: 'id',
    },
    allowNull: false,
  },
});

// Set up associations
// A Channel can have many Messages
Channel.hasMany(Message, { foreignKey: 'channelId', onDelete: 'CASCADE' });

// A User can send many Messages
User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages', onDelete: 'CASCADE' });

// A User can receive many Messages
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages', onDelete: 'CASCADE' });

// A Message belongs to a specific Channel
Message.belongsTo(Channel, { foreignKey: 'channelId' });

// A Message is sent by a specific User
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });

// A Message can be received by a specific User (only in case of direct messages)
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

// A Message can belong to a specific Group
Message.belongsTo(Group, { foreignKey: 'groupId', as: 'Group' });

module.exports = Message;
