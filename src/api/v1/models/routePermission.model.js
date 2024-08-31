const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Permission = require('./permission.model');

const routerPermission = sequelize.define('routePermission', {
  router_endpoint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Permission_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Permission,
      key: 'id'
    }
  },
  permission: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Example: An array of strings or integers
    allowNull: false
  }
});

// Correct One-to-Many Relationship Setup
Permission.hasMany(routerPermission, { foreignKey: 'Permission_id' });
routerPermission.belongsTo(Permission, { foreignKey: 'Permission_id' });

module.exports = routerPermission;
