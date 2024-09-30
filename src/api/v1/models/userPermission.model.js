const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const UserPermission = sequelize.define('UserPermission', {
    id : {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    },
    // permission: [{
    //     permission_name: DataTypes.STRING,
    //     permission_value: DataTypes.ARRAY(DataTypes.INTEGER) // 0 -> create , 1 -> edit , 2 -> read , 3 -> delete
    // }]
    permission: {
        type: DataTypes.JSONB, // Use JSONB to store an array of objects
        allowNull: false
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