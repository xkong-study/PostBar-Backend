var mysql = require('mysql2');

const poll = mysql.createPool({
    host: '3.248.182.99',
    port: 3306,
    user: 'root',
    password: 'dengjiaming123',
    database: 'luntan',
    connectionLimit: 50
});

module.exports = poll;