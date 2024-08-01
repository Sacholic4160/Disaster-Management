const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
//const User = require('./user.model.js')

const Disaster = sequelize.define('Disaster', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  }
})



module.exports = Disaster