const express = require("express");
const router = express.Router();

const group = require("../controller/group.controller");
const auth = require("../middleware");


router.route("/group")
    .get(group.getAllDevices);
    

router.route("/group/add")
    .post(group.addNewGroup);

router.route("/group/:id")
    .get(group.getDevicesWithId)
    .put(group.moveDeviceGroup)
    .delete(group.deleteGroup);

// router.route("/modules/:id")
//     .get(mcu.getMCUInformationByMac);

    
module.exports = router;