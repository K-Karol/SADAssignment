"use strict";

const express = require("express");
// const db = require("./database");

// const fetchData = require("./fetch-model");


const app = express();
app.get("/api", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/test", (req, res) => {
  fetchData.fetchData((data) => {
    res.send(data);
  })
});
app.listen(5000, () => console.log("Server is up and running"));
