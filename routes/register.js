const express = require("express");
const router = express.Router();
const handleRegister = require("../controllers/registerController");

router.use("/register", handleRegister);

module.exports = router;