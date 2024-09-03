require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DATABASE_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    port: 3307,
    connectionLimit: 10,
    multipleStatements: true
});

module.exports = pool;