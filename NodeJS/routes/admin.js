const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/admin")
const adminMiddleware = require("../middleware/admin");
const user_controller = require("../controllers/users");

router.get("/", (req, res) => {
  res.send("Admin endpoint root");
});

router.post("/createAdminUser", admin_controller.createAdminUser)

router.post("/users", user_controller.postUser)

module.exports = router;
