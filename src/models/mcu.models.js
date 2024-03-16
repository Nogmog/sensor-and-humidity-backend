const db = require("../../db");


const addInformation = (mcu, user_id, done) => {
    const SQL = "INSERT INTO MCU_data (mac_address, temperature, humidity, date, connected_user) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?);"
    let values = [mcu.mac_address, mcu.temperature, mcu.humidity, user_id];

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

const addDevice = (info, token, id, done) => {
    const SQL = "INSERT INTO device_info(mac_address, token, name, group_id, connected_user) VALUES(?, ?, ?, ?, ?);"

    let values = [info.mac_address, token, info.name, info.group_id, id];
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

const getAllDevices = (user_id, done) => {
    const SQL = "SELECT mac_address, name, group_id FROM device_info WHERE connected_user=?;"

    db.query(SQL, [user_id], function(err, result){
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404);

        return done(result, null)
    })
}

module.exports = {
    addInformation: addInformation,
    getInformationByMac: getInformationByMac,
    addDevice: addDevice,
    getDeviceTokenFromMac: getDeviceTokenFromMac,
    getAllDevices: getAllDevices
};