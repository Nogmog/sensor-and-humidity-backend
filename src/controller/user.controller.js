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

const createAccountDummy = (req, res) => {
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
                    // CREATION OF DUMMY DATA
                    user.getUserInformationFromEmail(req.body.email, (result, err) => {
                        if (err === 404) return res.sendStatus(404);
                        if (err) return res.sendStatus(500);

                        let user_id = result.user_id;
                        let name = result.name;

                        user.dummyCreateGroups(user_id, name, (err) => {
                            if (err) return res.status.send(err);
                            user.dummyRetrieveUserGroups(user_id, (result, err) => {
                                if (err === 404) return res.sendStatus(404);
                                if (err) return res.status(500).send(err);

                                let userGroups = result;
                                console.log("ALL COLLECTED DATA:", user_id, userGroups)

                                user.dummyAddDevicesToUserGroups(user_id, userGroups, (err) => {
                                    if (err) return res.status(500).send(err);
                                    user.dummyGetUserDevices(user_id, (err, result) => {
                                        if (err) return res.status(500).send(err);
                                        let userDevices = result;
                                        // console.log(userDevices)
                                        user.dummyAddDeviceDataToDevice(user_id, userDevices, (err) => {
                                            if (err) return res.status(500).send(err)
                                            return res.status(201).send({ "session-token": data })
                                        })


                                    })
                                })
                            })

                        })

                        // return res.status(201).send({ "session-token": data })
                    })

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
    createAccountDummy: createAccountDummy,
    userLogin: userLogin,
    userLogout: userLogout
}