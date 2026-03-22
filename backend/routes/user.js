const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

router.post("/", userCtrl.register);

module.exports = router;
