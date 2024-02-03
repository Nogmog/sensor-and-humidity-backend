const express = require("express");
const router = express.Router();

const mcu = require("./mcu.controller");

router.route("/modules/add")
    .get(mcu.showPage)
    .post(mcu.addMCUInformation);

    
module.exports = router;
// const mcu = require("./mcu.controller");

// module.exports = function(app){
//     app.route("/modules/add")
//         .get(mcu.showPage)
//         .post(mcu.addMCUInformation);
// }