const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Group = require('./group.model');

const Channel = sequelize.define('Channel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  isGroup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  members: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
  groupId: {
    type: DataTypes.UUID,
    references: {
      model: 'Group',
      key: 'id',
    },
    allowNull: true,
  },
}, {
  timestamps: true,
})

// Define the relationships
Channel.belongsTo(Group, { foreignKey: 'groupId' }); // Each channel belongs to one group
Group.hasOne(Channel, { foreignKey: 'groupId' });   // Each group has one channel

module.exports = Channel;

