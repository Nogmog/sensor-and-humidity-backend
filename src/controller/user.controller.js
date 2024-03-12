const user = require("../models/user.models");
const Joi = require("joi");


const createAccount = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required(),
        "name": Joi.string().required(),
        "email": Joi.string().email({tlds: { allow: false }}).required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    user.createNewAccount(req.body, (data, err) => {
        if(err) return res.sendStatus(500)

        return res.sendStatus(201);
    })


}

const userLogin = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required(),
        "email": Joi.string().email({tlds: { allow: false }}).required()
    })

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    user.getUserInformationFromUID(req.body.user_token, (data, err) => {
        if(err === 404) return res.status(404).send("User not found");
        if(err) return res.sendStatus(500);

        // check data given has matching email
        if(data.email == req.body.email){
            user.createNewSessionTokenForUser(data.user_token, (data, err) => {
                if(err) return res.sendStatus(500);
                return res.status(200).send({"session-token": data})
            })
        }
        else{
            return res.sendStatus(401);
        }
    })

    // return res.sendStatus(501);

}

const userLogout = (req, res) => {

    user.removeSessionToken(req.body.user_token, (err) => {
        if(err) return res.sendStatus(500)

        return res.sendStatus(200)
    })
}



module.exports = {
    createAccount: createAccount,
    userLogin: userLogin,
    userLogout: userLogout
}