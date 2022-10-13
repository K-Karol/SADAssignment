"use strict";

const { application } = require("express");
const express = require("express");
const app = express();
const db = require("./database");
var bodyParser = require('body-parser');

const user_route = require("./routes/users");

// const fetchData = require("./fetch-model");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/api", (req, res) => {res.send("Root of the API")})

app.use("/api/userAPI",user_route);

app.listen(5000, () => console.log("Server is up and running"));
