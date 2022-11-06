const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/admin")
const adminMiddleware = require("../middleware/admin");

router.get("/", adminMiddleware.authAPIKey, (req, res) => {
  res.send("Admin endpoint root");
});

router.post("/createAdminUser", adminMiddleware.authAPIKey, admin_controller.createAdminUser)

module.exports = router;
