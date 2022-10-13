const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/users")
// // middleware that is specific to this router
// router.use((req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
//   })

router.get("/", (req, res) => {
  res.send("Users home page");
});

router.post("/user", user_controller.create);
router.get("/users", user_controller.findAll);

router.get("/about", (req, res) => {
  res.send("About users");
});

module.exports = router;
