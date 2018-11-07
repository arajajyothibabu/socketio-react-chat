const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/chat_app_db');

module.exports = conn;