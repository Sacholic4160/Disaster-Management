// models/group.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  members:{
    type: DataTypes.ARRAY(DataTypes.UUID),
    
  }
}, {
  timestamps: true,
});

module.exports = Group;
