const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const ReliefCamp = sequelize.define('ReliefCamp', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = ReliefCamp;