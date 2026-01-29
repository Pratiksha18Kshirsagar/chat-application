const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
        allowNull: true,
    },
    Phone:{
        type: DataTypes.INTEGER,
    },
    Password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
  }
);

module.exports = User;
