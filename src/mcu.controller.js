const mcu = require("./mcu.models");
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
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        };

        return res.sendStatus(201);
    })
}

const getMCUInformationByMac = (req, res) => {
    let id = req.params.id;

    mcu.getInformationByMac(id, (data, err) => {
        if(err){
            return res.status(500).send(err);
        }
        return res.status(200).send(data);
    })
}

module.exports = {
    showPage: showPage,
    addMCUInformation: addMCUInformation,
    getMCUInformationByMac: getMCUInformationByMac
}