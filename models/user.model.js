const { DataType } = require('sequelize')
const sequelize = require('../config/db.js')

const User = sequelize.define('User', {
    userName : {
        type : DataType.STRING,
        allowNull: false,
        unique: true

    },
    password: {
        type: DataType.STRING,
        allowNull: false
    },
    role: {
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'rider'
    }
})


module.exports = User