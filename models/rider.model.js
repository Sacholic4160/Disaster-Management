const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')

const Rider = sequelize.define('Rider', {
    name: {
        type: DataTypes.STRING,
        autoIncrement: true,
        primaryKey: true
    },
latitude: {
    type: DataTypes.STRING,
    allowNull: false
},
longitude: {
    type: DataTypes.STRING,
    allowNull: false
    },
    last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

})

module.exports = Rider