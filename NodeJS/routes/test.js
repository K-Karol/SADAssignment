const express = require("express");
const router = express.Router();
const User = require("../models/user");
const respGen = require("../apiResponse");


const authMiddleware = require("../middleware/auth");
router.get("/", authMiddleware.isLoggedIn , async(req, res) => {
    const { username } = req.user; 
    var failed = false;
    var err = null;
    var usr = await User.findOne({ username })
    .catch((error) => {err = error; failed = true;});
    if(failed){
        res.status(400).json(respGen.generateResult(false, null, "User not found"));
    } else{
        res.json(respGen.generateResult(true, usr.username));
    }
});

module.exports = router;
