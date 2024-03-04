const db = require("../../db");


const getDevicesFromId = (id, done) => {
    const SQL = "SELECT mac_address, name, group_id FROM device_info WHERE group_id=?;"

    db.query(SQL, [id], function(err, result){
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404);

        return done(result, null)
    })
}

const updateDeviceGroup = (mac, group_id, done) => {
    const SQL = "UPDATE device_info SET group_id = ? WHERE mac_address = ?;"
    let values = [group_id, mac]

    db.query(SQL, values, function(err, result){
        if(err) return done(null, err)
        return done(result, null);
    })
}

const addNewGroup = (name, id, done) => {
    const SQL = "INSERT INTO device_group(name, connected_user) VALUES(?, ?);"

    db.query(SQL, [name, id], function(err, result){
        if(err) return done(null, err)
        return done(result, null)
    })
}

const getGroupIdFromMac = (mac, done) => {
    const SQL = "SELECT group_id FROM device_info WHERE mac_address = ?;"

    db.query(SQL, [mac], function(err, result){
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404);

        return done(result, null);
    })
}

const deleteGroup = (id, done) => {
    const SQL = "DELETE FROM device_group WHERE id = ?;"

    db.query(SQL, [id], function(err, result){
        if(err) return done(null, err)

        return done(result, null);
    })
}


const getGroup = (id, done) => {
    const SQL = "SELECT * FROM device_group WHERE id = ?;"

    db.query(SQL, [id], function(err, result){
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404);

        return done(result[0], null);
    })
}

const getAllGroupsFromUser = (id, done) => {
    const SQL = "SELECT * FROM device_group WHERE connected_user=?;"

    db.query(SQL, [id], function(err, result){
        if(err) return done(null, err)
        if(result[0] === undefined || result[0] === null) return done(null, 404);

        return done(result, null);
    })
}


module.exports = {
    getDevicesFromId: getDevicesFromId,
    updateDeviceGroup: updateDeviceGroup,
    addNewGroup: addNewGroup,
    getGroupIdFromMac: getGroupIdFromMac,
    deleteGroup: deleteGroup,
    getGroup: getGroup,
    getAllGroupsFromUser: getAllGroupsFromUser
};