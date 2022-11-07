const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/users");
const authMiddleware = require("../middleware/auth");

router.post("/register", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]),  user_controller.register);

// crud

router.get("/", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]), user_controller.getUsers);
router.get("/:id", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]), user_controller.getUser);

//router.post("/", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]), user_controller.postUserBatched);

// router.post("/batch", authMiddleware.authenticateRequest, authMiddleware.checkRoles(["Admin"]));
module.exports = router;
