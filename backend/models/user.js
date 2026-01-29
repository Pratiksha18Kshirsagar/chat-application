const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Phone: {
      type: DataTypes.INTEGER,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }
);

module.exports = User;
