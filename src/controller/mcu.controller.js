const mcu = require("../models/mcu.models");
const Joi = require("joi");

const showPage = (req, res) => {
    res.status(200).send("urmum: lol");
}

const addMCUInformation = (req, res) => {
    const schema = Joi.object({
        "mac_address": Joi.string().required(),
        "temperature": Joi.number().required(),
        "humidity": Joi.number().required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    mcu.addInformation(req.body, (data, err) => {
        if(err) return res.sendStatus(500);

        return res.sendStatus(201);
    })
}

const getMCUInformationByMac = (req, res) => {
    let id = req.params.id;

    mcu.getInformationByMac(id, (data, err) => {
        // if(err === 404) return res.sendStatus(404);
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

    mcu.addDevice(req.body, "temp", (data, err) => {
        if(err) return res.sendStatus(500);

        mcu.getDeviceTokenFromMac(req.body.mac_address, (data, err)  => {
            if(err === 404) return res.sendStatus(404);
            if(err) return res.sendStatus(500);
            
            return res.status(201).send(data[0]);
        })
        
    })


}

module.exports = {
    showPage: showPage,
    addMCUInformation: addMCUInformation,
    getMCUInformationByMac: getMCUInformationByMac,
    addNewDevice: addNewDevice
}