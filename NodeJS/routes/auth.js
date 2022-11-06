const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth")
router.get("/", (req, res) => {
  res.send("Authentication endpoint root");
});

router.post("/login", auth_controller.login)

module.exports = router;
