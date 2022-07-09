const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:id", userController.update);
router.post("/refresh", userController.refresh);
router.get("/", userController.getUserList);

module.exports = router;
