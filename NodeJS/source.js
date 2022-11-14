"use strict";

require("dotenv").config()
const { application } = require("express");
const express = require("express");
const app = express();
const db = require("./database");
const cors = require("cors");

var bodyParser = require('body-parser');

const auth_route = require("./routes/auth");
const admin_route = require("./routes/admin");
const user_route = require("./routes/users");
const test_route = require("./routes/test");
const course_route = require("./routes/courses");
const session_route = require("./routes/session");

const admin_middleware = require("./middleware/admin");
const auth_middleware = require("./middleware/auth");


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

app.use("/api/admin", admin_middleware.authAPIKey , admin_route); //ONLY USE IN DEBUG MODE


app.use("/api/test", test_route);

app.use("/api/users", auth_middleware.authenticateRequest, user_route);
app.use("/api/courses", auth_middleware.authenticateRequest, course_route);
app.use("/api/session", auth_middleware.authenticateRequest, session_route);

app.listen(PORT, () => console.log("Server is up and running"));
