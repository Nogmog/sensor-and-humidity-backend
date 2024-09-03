require('dotenv').config();
const mysql = require('mysql2');
const fs = require("fs")


const pool = mysql.createPool({
    host: process.env.DATABASE_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    connectionLimit: 10,
    multipleStatements: true,
    ssl: {
        ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
    }
});

module.exports = pool;