const user = require("../models/user.models");
const Joi = require("joi");


const createAccount = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required(),
        "name": Joi.string().required(),
        "email": Joi.string().email({ tlds: { allow: false } }).required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check user exists
    user.getUserInformationFromEmail(req.body.email, (data, err) => {
        if (err === 404) {
            user.createNewAccount(req.body, (data, err) => {
                if (err) return res.sendStatus(500)

                // make new session for user
                user.createNewSessionTokenForUserId(data.insertId, (data, err) => {
                    if (err) return res.sendStatus(500);
                    return res.status(201).send({ "session-token": data })
                })
            })
        } else if (err) {
            console.log(err)
            return res.sendStatus(500)
        } else {
            return res.status(400).send({ "Error": "User already exists" })
        }

    })



}

const userLogin = (req, res) => {
    const schema = Joi.object({
        "user_token": Joi.string().required(),
        "email": Joi.string().email({ tlds: { allow: false } }).required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(403).send(error.details[0].message);

    user.getUserInformationFromUID(req.body.user_token, (data, err) => {
        if (err === 404) return res.status(404).send({ "Error:": "User not found" });
        if (err) return res.sendStatus(500);

        // check data given has matching email
        if (data.email == req.body.email) {
            let userId = data.user_id
            // check if user already has token
            user.getSessionTokenFromUserId(userId, (token, err) => {
                // NO TOKEN
                if (err === 404 || !token) {
                    user.createNewSessionTokenForUserId(userId, (token, err) => {
                        if (err) return res.sendStatus(500);
                        return res.status(200).send({ "session-token": token })
                    })
                }
                if (err) return res.sendStatus(500);
                // HAS TOKEN
                return res.status(200).send({ "session-token": token })
            })

        }
        else {
            return res.sendStatus(401);
        }
    })

    // return res.sendStatus(501);

}

const userLogout = (req, res) => {

    user.removeSessionToken(req.query.user, (err) => {
        if (err) return res.sendStatus(500)

        return res.sendStatus(200)
    })
}



module.exports = {
    createAccount: createAccount,
    userLogin: userLogin,
    userLogout: userLogout
}