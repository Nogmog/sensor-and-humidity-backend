const user = require("../models/user.models");
const Joi = require("joi");


const userLogin = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    return res.sendStatus(501);

}

const userLogout = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    return res.sendStatus(501);
}



module.exports = {
    userLogin: userLogin,
    userLogout: userLogout
}