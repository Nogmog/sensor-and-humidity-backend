const express = require("express");
const router = express.Router();

const user = require("../controller/user.controller");
const auth = require("../middleware");

router.route("/user/create")
    .post(user.createAccount);

router.route("/user/login")
    .post(user.userLogin);

router.route("/user/logout")
    .post(auth.loggedInAuth, user.userLogout);

module.exports = router;