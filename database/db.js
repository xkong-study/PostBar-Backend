var mysql = require('mysql2');

const poll = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dengjiaming123',
    database: 'luntan',
    connectionLimit: 50
});

module.exports = poll;