const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')

const Volunteer = sequelize.define('Volunteer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
      type: DataTypes.TEXT,
    },
  });

  module.exports = Volunteer;