const db = require("../../db");
const crypto = require("crypto");

const createNewAccount = (data, done) => {
    const SQL = "INSERT INTO user_data(user_token, name, email) VALUES (?, ?, ?);";

    let values = [data.user_token, data.name, data.email]

    db.query(SQL, values, function(err, result){
        if(err) return done(null, err)
        return done(result[0], null)
    })
}


const getUserInformationFromUID = (uid, done) => {
    const SQL = "SELECT * FROM user_data WHERE user_token=?;"

    db.query(SQL, [uid], function(err, result) {
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404)
        return done(result[0], null);
    })
}

const createNewSessionTokenForUser = (uid, done) => {
    let token = crypto.randomBytes(128).toString("hex");

    const SQL = "UPDATE user_data SET session_token=? WHERE user_token=?;"

    db.query(SQL, [token, uid], function(err, result) {
        if(err) return done(null, err)
        return done(token, null);
    })
}

const removeSessionToken = (uid, done) => {
    const SQL = "UPDATE user_data SET session_token=null WHERE user_token=?;"

    db.query(SQL, [uid], function(err, result) {
        if(err) return done(err)
        return done(null);
    })
}

module.exports = {
    createNewAccount: createNewAccount,
    getUserInformationFromUID: getUserInformationFromUID,
    createNewSessionTokenForUser: createNewSessionTokenForUser,
    removeSessionToken: removeSessionToken
};