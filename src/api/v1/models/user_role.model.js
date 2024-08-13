const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Role = require('./role.model');

const UserRole = sequelize.define('UserRole', {
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.UUID,
    references: {
      model: Role,
      key: 'id'
    }
  }
});

User.hasMany(UserRole, { foreignKey: 'userId' });
Role.hasMany(UserRole, { foreignKey: 'roleId' });

module.exports = UserRole;
