const express = require("express");
const router = express.Router();
const handleLogout = require("../controllers/logoutController");

router.get("/logout", handleLogout);

module.exports = router;