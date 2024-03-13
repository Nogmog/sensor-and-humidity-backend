require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DATABASE_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: 6306,
    // connectionLimit: 10
});

// pool.getConnection(function(err, connection){
//     if(err) console.log("POOL ERR:", err)

//     connection.changeUser({database : "moistste"}, function(err){
//         if(err) console.log("CHANGE USER ERR:", err)
//     })

// })

connection.connect(function(err){
    if(err) console.log("CONNECTION ERR:",err)
    console.log("Connected to database");
})

connection.changeUser({database : "moistste"}, function(err){
    if(err) console.log("CHANGE USER ERR:", err)
})


module.exports = connection;