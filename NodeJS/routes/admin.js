const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/admin")
const adminMiddleware = require("../middleware/admin");
const user_controller = require("../controllers/users");

router.get("/", adminMiddleware.authAPIKey, (req, res) => {
  res.send("Admin endpoint root");
});

router.post("/createAdminUser", adminMiddleware.authAPIKey, admin_controller.createAdminUser)

router.post("/users", adminMiddleware.authAPIKey, user_controller.postUser)

module.exports = router;
