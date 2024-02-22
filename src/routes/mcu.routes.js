const express = require("express");
const router = express.Router();

const mcu = require("../controller/mcu.controller");
const auth = require("../middleware");


router.route("/modules")
    .get(mcu.showPage)
    .post(auth.macAuthentication, mcu.addMCUInformation);

router.route("/modules/add")
    .post(mcu.addNewDevice)

router.route("/modules/:id")
    .get(mcu.getMCUInformationByMac);

    
module.exports = router;
// const mcu = require("./mcu.controller");

// module.exports = function(app){
//     app.route("/modules/add")
//         .get(mcu.showPage)
//         .post(mcu.addMCUInformation);
// }