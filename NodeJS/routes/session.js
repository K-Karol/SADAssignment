const express = require("express");
const router = express.Router();
const session_controller = require("../controllers/session");

router.get("/session/", session_controller.FindAllSessions); //find all session

router.get("/session/:id/", session_controller.FindSessionAttendence); //get a sessions
//router.get("/session/:date", session_controller.FindSessionAttendence); //get all session where date matches

router.get("/session/:id/:user/", session_controller.FindUserAttendence); //get session info for user

router.patch("/session/:id/", session_controller.UpdateUserAttendence); //patch because its updating not replacing

module.exports = router; //manditory ending