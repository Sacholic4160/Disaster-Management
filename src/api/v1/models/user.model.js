const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')

const User = sequelize.define('User', {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user '
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull:false
    }
})


module.exports = User