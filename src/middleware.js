const Joi = require("joi");

const mcu = require("./auth.models");


const macAuthentication = function(req, res, next){
    const schema = Joi.object({
        "mac_address": Joi.string().required()
    }).options({ allowUnknown: true})

    const { error } = schema.validate(req.body);
    if(error) return res.status(401).send(error.details[0].message);

    let device_auth = req.get("device-auth");
    let mac_address = req.body.mac_address;

    if(device_auth === undefined || mac_address === undefined){
        return res.sendStatus(401);
    }

    mcu.getMacAddressFromToken(device_auth, (result, err) => {
        if(err === 404) return res.sendStatus(401);
        if(err) return res.sendStatus(500);
        
        if(result.mac_address === mac_address){
            next();
        }
        else{
            return res.sendStatus(401);
        }
        
    })
    
}

module.exports = {
    macAuthentication: macAuthentication
}