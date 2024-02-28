const db = require("../../db");

const getMacAddressFromToken = (token, done) => {
    const SQL  = "SELECT * FROM device_info WHERE token=?;";

    db.query(SQL, [token], function(err, result) {
        if(err) return done(null, err);
        if(result[0] === undefined || result[0] === null) return done(null, 404);
        
        return done(result[0], null)
    })
}

const getSessionTokenFromUser = (token, done) => {
    const SQL = "SELECT * FROM user_data WHERE user_token=?;"

    db.query(SQL, [token], function(err, result) {
        if(err) return done(null, err);
        if(result[0] === undefined || result[0] === null) return done(null, 404);
        
        return done(result[0], null)
    })
}



module.exports = {
    getMacAddressFromToken: getMacAddressFromToken,
    getSessionTokenFromUser: getSessionTokenFromUser
};