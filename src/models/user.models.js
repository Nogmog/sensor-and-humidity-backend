const db = require("../../db");
const crypto = require("crypto");


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
        done(token, null);
    })
}

const removeSessionToken = (uid, done) => {
    const SQL = "UPDATE user_data SET session_token=null WHERE user_token=?;"

    db.query(SQL, [uid], function(err, result) {
        if(err) return done(err)
        done(null);
    })
}

module.exports = {
    getUserInformationFromUID: getUserInformationFromUID,
    createNewSessionTokenForUser: createNewSessionTokenForUser,
    removeSessionToken: removeSessionToken
};