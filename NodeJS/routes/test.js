const express = require("express");
const router = express.Router();
const User = require("../models/user");
const respGen = require("../apiResponse");


const authMiddleware = require("../middleware/auth");
router.get("/", authMiddleware.authenticateRequest, (req, res) => {
    res.json(respGen.generateResult(true, req.user.username));
});

router.get("/checkAdmin", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]),  async(req, res) => {
    res.json(respGen.generateResult(true, "wassup admin"));
});

module.exports = router;
