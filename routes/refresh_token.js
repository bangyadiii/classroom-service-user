const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controller/refresh-token.controller");

router.get("/", refreshTokenController.getToken);
router.post("/", refreshTokenController.create);

module.exports = router;
