const {Sequelize} = require("sequelize");
const sequelize  = require('../db/db-connect');

const Board = sequelize.define('useriai', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    displayname: {
        type: Sequelize.STRING,
    },
    koduku_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

module.exports = Board;