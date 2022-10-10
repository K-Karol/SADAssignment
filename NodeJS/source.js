"use strict";

const express = require("express");
const mongoose = require("mongoose");

// mongoose.connect("mongodb://root:rootpassword@localhost:4321/?authMechanism=DEFAULT", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Bind connection to error event (to get notification of connection errors)

const dns = require("dns");
const request = require("request");

var nginxIP = null;

dns.lookup("nginx", 4, (err, address) => (nginxIP = address));

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/test", (req, res) => {
  console.log("Connecting to mongoose");

  if (nginxIP == null) {
    res.send("dns not resolved yet");
    return;
  }

  request(`http://${nginxIP}:4321`, {}, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(body.url);
    console.log(body.explanation);
    console.log(body);
  });

  mongoose.connect(`mongodb://root:rootpassword@${nginxIP}:4321/testing`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  res.send("test");
});
app.listen(5000, () => console.log("Server is up and running"));
