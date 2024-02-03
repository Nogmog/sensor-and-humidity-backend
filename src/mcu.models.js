const db = require("../db");


const addInformation = (mcu, done) => {
    const SQL = "INSERT INTO MCU_data (mac_address, temperature, humidity) VALUES (?, ?, ?);"
    let values = [mcu.mac_address, mcu.temperature, mcu.humidity];

    db.query(SQL, values, function(err, result) {
        if (err) return done(null, err);
        return done(result, null);
    });
}


module.exports = {
    addInformation: addInformation
};