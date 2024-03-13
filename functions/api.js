const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

// let corsOptions = {
//     origin: "http://localhost:5000",
//     optionsSuccessStatus: 200
// }

app.use(express.json());
// app.use(cors(corsOptions));

const router = express.Router();
router.use(cors());

app.get("/api", (req, res) => {
    res.json({"status": "Online"});
});

// Endpoints
const mcuRouter = require("../src/routes/mcu.routes");
const groupRouter = require("../src/routes/group.routes");
const userRouter = require("../src/routes/user.routes");

const HTTP_LINK = "/api";

app.use(HTTP_LINK, router); 
app.use(HTTP_LINK, mcuRouter);
app.use(HTTP_LINK, groupRouter);
app.use(HTTP_LINK, userRouter);

// // page not found
app.use(function(req, res){
    res.status(404).send("Page not found");
})

module.exports.handler = serverless(app);