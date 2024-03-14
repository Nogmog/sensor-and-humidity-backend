const mcu = require("../models/mcu.models");
const Joi = require("joi");


const addMCUInformation = (req, res) => {
    const schema = Joi.object({
        "mac_address": Joi.string().required(),
        "temperature": Joi.number().required(),
        "humidity": Joi.number().required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user_id = res.locals.user_id;

    mcu.addInformation(req.body, user_id, (data, err) => {
        if(err) return res.sendStatus(500);

        return res.sendStatus(201);
    })
}

const getMCUInformationByMac = (req, res) => {
    let id = req.params.id;

    mcu.getInformationByMac(id, (data, err) => {
        if(err === 404) return res.status(404).send({"Error": "Device not found"});
        if(err) return res.status(500).send(err);

        return res.status(200).send(data);
    })
}

const addNewDevice = (req, res) => {
    const schema = Joi.object({
        "mac_address": Joi.string().required(),
        "name": Joi.string().required(),
        "group_id": Joi.number().required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // NEED TO CREATE TOKEN!
    let token = "temp";
    let user_id = res.locals.user_id;
    
    mcu.addDevice(req.body, token, user_id, (data, err) => {
        if(err) return res.sendStatus(500);

        mcu.getDeviceTokenFromMac(req.body.mac_address, (data, err)  => {
            if(err === 404) return res.sendStatus(404);
            if(err) return res.sendStatus(500);
            
            return res.status(201).send(data);
        })
        
    })


}

const getAllDevices = (req, res) => {
    let user_id = res.locals.user_id;
    mcu.getAllDevices(user_id, (data, err) => {
        if(err === 404) return res.status(404).send("No devices found");
        if(err) return res.sendStatus(500);

        return res.status(200).send(data);
    })
}


module.exports = {
    addMCUInformation: addMCUInformation,
    getMCUInformationByMac: getMCUInformationByMac,
    addNewDevice: addNewDevice,
    getAllDevices: getAllDevices
}