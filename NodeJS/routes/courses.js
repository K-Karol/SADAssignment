const express = require("express");
const router = express.Router();
const course_controller = require("../controllers/courses");
const authMiddleware = require("../middleware/auth");


// crud

router.get("/", authMiddleware.checkRoles(["Admin"]), course_controller.getCourses);
router.get("/:id", authMiddleware.checkRoles(["Admin"]), course_controller.getCourse);
router.post("/", authMiddleware.checkRoles(["Admin"]), course_controller.postCourse);

//router.post("/", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Adsmin"]), user_controller.postUserBatched);

// router.post("/batch", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]));
module.exports = router;
