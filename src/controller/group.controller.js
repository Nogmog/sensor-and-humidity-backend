const group = require("../models/group.models");

const Joi = require("joi");

const getAllDevices = (req, res) => {
    let user_id = res.locals.user_id;
    group.getAllDevices(user_id, (data, err) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500);

        return res.status(200).send(data);
    })
}

const getDevicesWithId = (req, res) => {
    let id = req.params.id;
    group.getDevicesFromId(id, (data, err) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500);

        return res.status(200).send(data);
    })
}

const addNewGroup = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required(),
        "name": Joi.string().required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user_id = res.locals.user_id

    group.addNewGroup(req.body.name, user_id, (data, err) => {
        if(err) res.sendStatus(500)
        res.status(201).send({"insertId": data.insertId});
    })
}

const moveDeviceGroup = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required(),
        "mac_address": Joi.string().required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let id = req.params.id;
    if(id === undefined || id === undefined){
        return res.sendStatus(400);
    }

    //check device exists
    group.getGroupIdFromMac(req.body.mac_address, (data, err) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500)

        if(data[0].group_id == id) return res.sendStatus(304)

        //check group exists
        group.getGroup(id, (data, err) =>{
            if(err === 404) return res.sendStatus(404);
            if(err) return res.status(500).send(err);

            let user_id = res.locals.user_id;
            // check if authorised
            if(data.connected_user != user_id){
                return res.status(401).send("User unauthorised for this group");
            }

            group.updateDeviceGroup(req.body.mac_address, id, (data, err) => {
                if(err) return res.status(500).send(err);
                return res.sendStatus(204)
            })
        })


    })

}

const deleteGroup = (req, res) => {
    let id = req.params.id;

    //check group exists
    group.getGroup(id, (data, err) => {
        if(err === 404) return res.sendStatus(404)
        if(err) return res.sendStatus(500)

        let user_id = res.locals.user_id;
        // check if authorised
        if(data.connected_user != user_id){
            return res.status(401).send("User unauthorised for this group");
        }

        group.deleteGroup(id, (data, err) => {
            if(err) return res.sendStatus(500);

            return res.sendStatus(200);
        })

    })
}


module.exports = {
    getAllDevices: getAllDevices,
    getDevicesWithId: getDevicesWithId,
    addNewGroup: addNewGroup,
    moveDeviceGroup: moveDeviceGroup,
    deleteGroup: deleteGroup
}