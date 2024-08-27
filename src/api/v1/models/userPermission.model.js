const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const UserPermission = sequelize.define('UserPermission', {
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    },
    permission: {
        type: DataTypes.JSONB, // Store permissions as JSONB to handle arrays
        allowNull: false,
        defaultValue: []
    }
});


// A User has many permissions
User.hasMany(UserPermission, {
    foreignKey: 'user_id', // This is the foreign key in the UserPermission model
    as: 'permissions' // This is the alias for the relation
});

// A UserPermission belongs to a User
UserPermission.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = UserPermission;