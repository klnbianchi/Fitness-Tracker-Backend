// create the express server here
require('dotenv').config();

const express = require('express');
const {PORT = 3000} = process.env;
const server = express();

server.use(express.json());

const morgan = require("morgan");
server.use(morgan("dev"));

const cors = require("cors")
server.use(cors());

const apiRouter = require("./api");
server.use("/api", apiRouter);

const client = require("./db/client");

server.use(function (req,res,next){
    res.status(404).send('Unable to find the requested resource!')
})

server.use(function (err,req,res,next){
    res.status(500).send({error: err.message})
})


server.listen(PORT, ()=>{
    client.connect();
    console.log("The server is up on port", PORT);
})

