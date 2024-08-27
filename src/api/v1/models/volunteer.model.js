const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./user.model.js');

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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skills: {
    type: DataTypes.TEXT,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'User',
      key: 'id',
    },
    allowNull: false, // Ensures that every Volunteer must be associated with a User
  },
  experience: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false,
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}); 


// Establishing the relationship
User.hasOne(Volunteer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Volunteer.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Volunteer;
