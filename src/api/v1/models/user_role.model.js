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

// User can have many Roles through UserRole
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });

// Role can belong to many Users through UserRole
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

module.exports = UserRole;
