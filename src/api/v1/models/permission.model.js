const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Permission = sequelize.define('Permission', {
  id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
  },
  permission_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  is_default: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Permission;