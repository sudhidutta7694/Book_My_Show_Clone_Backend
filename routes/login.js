const express = require("express");
const router = express.Router();
const handleLogin = require("../controllers/authController");

router.post("/login", handleLogin);

module.exports = router;