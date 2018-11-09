const Sequelize = require('sequelize');
const conn = new Sequelize('chat_app_db', 'jyothi', 'jyothi', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = conn;