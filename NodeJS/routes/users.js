const express = require("express");
const router = express.Router();
const user_constoller = require("../controllers/users");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware.authenticateRequest, (req, res) => {
  res.send("Users endpoint root");
});

router.post("/register", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]),  user_constoller.register);

module.exports = router;
