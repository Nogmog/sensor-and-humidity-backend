const express = require("express");
const router = express.Router();

const group = require("../controller/group.controller");
const auth = require("../middleware");


router.route("/group")
    .get(auth.loggedInAuth, group.getAllGroups);

router.route("/group/add")
    .post(auth.loggedInAuth, group.addNewGroup);

router.route("/group/:id")
    .get(auth.loggedInAuth, group.getDevicesWithGroupId)
    .put(auth.loggedInAuth, group.moveDeviceGroup)
    .delete(auth.loggedInAuth, group.deleteGroup);


    
module.exports = router;