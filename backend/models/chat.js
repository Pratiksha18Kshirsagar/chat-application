const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Chat = sequelize.define(
    'Chat',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

module.exports = Chat;