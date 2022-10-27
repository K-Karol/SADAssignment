"use strict";

require("dotenv").config()
const { application } = require("express");
const express = require("express");
const app = express();
const db = require("./database");
const cors = require("cors");

var bodyParser = require('body-parser');

const auth_route = require("./routes/auth");
const test_route = require("./routes/test");

const {PORT = 5000, CORS_ORIGIN="https://localhost"} = process.env

// const fetchData = require("./fetch-model");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var corsOptions = {
  origin: CORS_ORIGIN
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {res.send("Root of the API")})

app.use("/api/auth", auth_route);

app.use("/api/test", test_route)

app.listen(PORT, () => console.log("Server is up and running"));
