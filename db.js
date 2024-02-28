require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool(process.env.DATABASE_URL);
console.log("Connected to database.")
module.exports = pool;