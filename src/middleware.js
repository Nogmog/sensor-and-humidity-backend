const Joi = require("joi");

const auth = require("./models/auth.models");

// MCU info
const macAuthentication = function(req, res, next){
    const schema = Joi.object({
        "mac_address": Joi.string().required()
    }).options({ allowUnknown: true })

    const { error } = schema.validate(req.body);
    if(error) return res.status(401).send(error.details[0].message);

    let device_auth = req.get("device-auth");
    let mac_address = req.body.mac_address;

    if(device_auth === undefined || mac_address === undefined){
        return res.sendStatus(401);
    }

    auth.getMacAddressFromToken(device_auth, (result, err) => {
        if(err === 404) return res.sendStatus(401);
        if(err) return res.sendStatus(500);
        
        if(result.mac_address === mac_address){
            res.locals.user_id = result.connected_user;
            next();
        }
        else{
            return res.sendStatus(401);
        }
        
    })
    
}

// user data
const loggedInAuth = function(req, res, next){
    const schema = Joi.object({
        "user_token": Joi.string().required()
    }).options({ allowUnknown: true })

    const { error } = schema.validate(req.body);
    if(error) return res.status(401).send(error.details[0].message);

    let user_token = req.body.user_token;
    let session_token = req.get("session-token");

    if(user_token === undefined || session_token === undefined){
        return res.status(401).send("No token sent");
    }

    auth.getSessionTokenFromUser(user_token, (result, err) => {
        if(err === 404) return res.sendStatus(401);
        if(err) return res.sendStatus(500);

        if(session_token === result.session_token){
            res.locals.user_id = result.user_id
            
            next()
        }else{
            return res.status(401).send("Incorrect login")
        }
    })
}

module.exports = {
    macAuthentication: macAuthentication,
    loggedInAuth: loggedInAuth
}