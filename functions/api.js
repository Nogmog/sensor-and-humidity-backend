const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({"status": "Online"});
});

// Endpoints
const mcuRouter = require("../src/mcu.routes");

const HTTP_LINK = "/api";

app.use(HTTP_LINK, router); 
app.use(HTTP_LINK, mcuRouter);

// // page not found
app.use(function(req, res){
    res.sendStatus(404);
})

module.exports.handler = serverless(app);