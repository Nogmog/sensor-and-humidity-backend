const { group } = require("console");
const db = require("../../db");
const crypto = require("crypto");

const createNewAccount = (data, done) => {
    const SQL = "INSERT INTO user_data(user_token, name, email) VALUES (?, ?, ?);";

    let values = [data.user_token, data.name, data.email]

    db.query(SQL, values, function (err, result) {
        if (err) return done(null, err)
        return done(result, null)
    })
}

const getUserInformationFromUID = (uid, done) => {
    const SQL = "SELECT * FROM user_data WHERE user_token=?;"

    db.query(SQL, [uid], function (err, result) {
        if (err) return done(null, err)
        if (result[0] === undefined || result[0] === null) return done(null, 404)
        return done(result[0], null);
    })
}

const createNewSessionTokenForUserId = (id, done) => {
    let token = crypto.randomBytes(128).toString("hex");

    const SQL = "UPDATE user_data SET session_token=? WHERE user_id=?;"

    db.query(SQL, [token, id], function (err, result) {
        if (err) return done(null, err)
        return done(token, null);
    })
}

const getSessionTokenFromUserId = (id, done) => {
    const SQL = "SELECT session_token FROM user_data WHERE user_id=?;";

    db.query(SQL, [id], function (err, result) {
        if (err) return done(null, err)
        if (result[0] === undefined || result[0] === null) return done(null, 404)

        return done(result[0].session_token, null);

    })
}

const removeSessionToken = (uid, done) => {
    const SQL = "UPDATE user_data SET session_token=null WHERE user_token=?;"

    db.query(SQL, [uid], function (err, result) {
        if (err) return done(err)
        return done(null);
    })
}

const getUserInformationFromEmail = (email, done) => {
    const SQL = "SELECT * FROM user_data WHERE email=?;"

    db.query(SQL, [email], function (err, result) {
        if (err) return done(null, err)
        if (result[0] === undefined || result[0] === null) return done(null, 404)
        return done(result[0], null);
    })
}


const dummyCreateGroups = (user_id, name, done) => {
    // add groups
    console.log("Creating groups")

    let groupNames = ["Living Room", name + "'s Room", "Kitchen"];
    const SQL = "INSERT INTO device_group(name, connected_user) VALUES (?, ?)"

    let values = [groupNames[0], user_id]

    db.query(SQL, values, function (err) {
        if (err) return done(err);

        values = [groupNames[1], user_id]
        db.query(SQL, values, function (err) {
            if (err) return done(err);

            values = [groupNames[2], user_id]
            db.query(SQL, values, function (err) {
                if (err) return done(err)
                return done(null)
            })
        })
    })
}

const dummyRetrieveUserGroups = (user_id, done) => {
    console.log("Retrieving groups")
    const SQL = "SELECT * FROM device_group WHERE connected_user=?"
    db.query(SQL, [user_id], function (err, result) {
        if (err) return done(null, err);
        if (result[0] === undefined || result[0] === null) return done(null, 404)

        return done(result);
    })
}

const dummyAddDevicesToUserGroups = (user_id, userGroups, done) => {
    console.log("Adding devices to groups")
    let livingRoomDevices = ["Window Device", "Next to TV", "Sofa"]
    let kitchenDevices = ["Next to kettle", "Sink device"]

    const SQL = "INSERT INTO device_info(mac_address, token, name, group_id, connected_user) VALUES (?,?,?,?,?)"

    let mac_address = crypto.randomBytes(8).toString("hex");
    let token = crypto.randomBytes(64).toString("hex");
    let values = [mac_address, token, livingRoomDevices[0], userGroups[0].id, user_id];

    db.query(SQL, values, function (err) {
        if (err) return done(err)

        mac_address = crypto.randomBytes(8).toString("hex");
        token = crypto.randomBytes(64).toString("hex");
        values = [mac_address, token, livingRoomDevices[1], userGroups[0].id, user_id];

        db.query(SQL, values, function (err) {
            if (err) return done(err)

            mac_address = crypto.randomBytes(8).toString("hex");
            token = crypto.randomBytes(64).toString("hex");
            values = [mac_address, token, livingRoomDevices[2], userGroups[0].id, user_id];

            db.query(SQL, values, function (err) {
                if (err) return done(err)

                mac_address = crypto.randomBytes(8).toString("hex");
                token = crypto.randomBytes(64).toString("hex");
                values = [mac_address, token, kitchenDevices[0], userGroups[1].id, user_id];

                db.query(SQL, values, function (err) {
                    if (err) return done(err)

                    mac_address = crypto.randomBytes(8).toString("hex");
                    token = crypto.randomBytes(64).toString("hex");
                    values = [mac_address, token, kitchenDevices[1], userGroups[1].id, user_id];

                    db.query(SQL, values, function (err) {
                        if (err) return done(err)
                        return done(null);
                    })
                })
            })
        })
    })
}

const dummyGetUserDevices = (user_id, done) => {
    const SQL = "SELECT * FROM device_info WHERE connected_user=?"

    db.query(SQL, [user_id], function (err, result) {
        if (err) return done(err)
        if (result[0] === undefined || result[0] === null) return done(null, 404)
        return done(null, result)

    })
}
const dummyAddDeviceDataToDevice = (user_id, userDevices, done) => {
    console.log("Adding stats to devices")
    // add to MCU_data
    SQL = "INSERT INTO MCU_data(mac_address, temperature, humidity, date, connected_user) VALUES (?,?,?,?,?)"
    let temperatureData = ["7.4", "7.42", "7.42", "7.5", "7.5", "7.51", "7.5", "7.5", "7.5", "7.52", "7.55", "7.6", "7.66", "7.66", "8.00", "7.93"];
    let humidityData = ["58.00", "58.00", "58.00", "58.20", "58.20", "58.20", "58.30", "58.30", "58.90", "59.20", "60.20", "60.80", "61.00", "61.00", "61.00", "61.20"];
    let times = ["2024-04-27 14:30:30", "2024-04-27 14:30:40", "2024-04-27 14:30:50", "2024-04-27 14:31:00", "2024-04-27 14:31:10", "2024-04-27 14:31:20", "2024-04-27 14:31:30", "2024-04-27 14:31:40", "2024-04-27 14:31:50", "2024-04-27 14:32:00", "2024-04-27 14:32:10", "2024-04-27 14:32:20", "2024-04-27 14:32:30", "2024-04-27 14:32:40", "2024-04-27 14:32:50", "2024-04-27 14:33:00"]

    let i = 0;
    let values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
    console.log(values);
    db.query(SQL, values, function (err) {
        if (err) return done(err)
        i++;
        values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]

        db.query(SQL, values, function (err) {
            if (err) return done(err)
            i++;
            values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]

            db.query(SQL, values, function (err) {
                if (err) return done(err)
                i++;
                values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                db.query(SQL, values, function (err) {
                    if (err) return done(err)
                    i++;
                    values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                    db.query(SQL, values, function (err) {
                        if (err) return done(err)
                        i++;
                        values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                        db.query(SQL, values, function (err) {
                            if (err) return done(err)
                            i++;
                            values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                            db.query(SQL, values, function (err) {
                                if (err) return done(err)
                                i++;
                                values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                db.query(SQL, values, function (err) {
                                    if (err) return done(err)
                                    i++;
                                    values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                    db.query(SQL, values, function (err) {
                                        if (err) return done(err)
                                        i++;
                                        values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                        db.query(SQL, values, function (err) {
                                            if (err) return done(err)
                                            i++;
                                            values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                            db.query(SQL, values, function (err) {
                                                if (err) return done(err)
                                                i++;
                                                values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                                db.query(SQL, values, function (err) {
                                                    if (err) return done(err)
                                                    i++;
                                                    values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                                    db.query(SQL, values, function (err) {
                                                        if (err) return done(err)
                                                        i++;
                                                        values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                                        db.query(SQL, values, function (err) {
                                                            if (err) return done(err)
                                                            i++;
                                                            values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                                            db.query(SQL, values, function (err) {
                                                                if (err) return done(err)
                                                                i++;
                                                                values = [userDevices[0].mac_address, temperatureData[i], humidityData[i], times[i], user_id]
                                                                db.query(SQL, values, function (err) {
                                                                    if (err) return done(err)
                                                                    return done(null);
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}

module.exports = {
    createNewAccount: createNewAccount,
    getUserInformationFromUID: getUserInformationFromUID,
    createNewSessionTokenForUserId: createNewSessionTokenForUserId,
    getSessionTokenFromUserId: getSessionTokenFromUserId,
    removeSessionToken: removeSessionToken,
    getUserInformationFromEmail: getUserInformationFromEmail,
    dummyCreateGroups: dummyCreateGroups,
    dummyRetrieveUserGroups: dummyRetrieveUserGroups,
    dummyAddDevicesToUserGroups: dummyAddDevicesToUserGroups,
    dummyGetUserDevices: dummyGetUserDevices,
    dummyAddDeviceDataToDevice: dummyAddDeviceDataToDevice
};