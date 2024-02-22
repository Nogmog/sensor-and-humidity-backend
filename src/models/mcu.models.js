const db = require("../../db");


const addInformation = (mcu, done) => {
    const SQL = "INSERT INTO MCU_data (mac_address, temperature, humidity, date) VALUES (?, ?, ?, CURRENT_TIMESTAMP);"
    let values = [mcu.mac_address, mcu.temperature, mcu.humidity];

    db.query(SQL, values, function(err, result) {
        if (err) return done(null, err);
        return done(result, null);
    });
}

const getInformationByMac = (id, done) => {
    const SQL = "SELECT * FROM MCU_data WHERE mac_address=?;"

    db.query(SQL, [id], function(err, result) {
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404)
        return done(result, null);
    })
}

const addDevice = (info, token, done) => {
    const SQL = "INSERT INTO device_info(mac_address, token, name, group_id) VALUES(?, ?, ?, ?);"

    let values = [info.mac_address, token, info.name, info.group_id];
    db.query(SQL, values, function(err, result){
        if(err) return done(null, err)
        return done(result, null)
    })
}

const getDeviceTokenFromMac = (mac, done) => {
    const SQL = "SELECT token FROM device_info WHERE mac_address = ?;"

    db.query(SQL, [mac], function(err, result){
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404)

        return done(result[0], null)
    })
}

module.exports = {
    addInformation: addInformation,
    getInformationByMac: getInformationByMac,
    addDevice: addDevice,
    getDeviceTokenFromMac: getDeviceTokenFromMac
};