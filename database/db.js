var mysql = require('mysql2');
// const config = require('config/db_config').db;

const poll = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dengjiaming123',
    database: 'luntan',
    connectionLimit: 50
});

module.exports = poll;