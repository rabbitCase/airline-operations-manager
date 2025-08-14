const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
	res.sendFile(
		path.join(__dirname, "..", "..", "frontend", "login-lf", "index.html")
	);
});

router.get("/index.html", (req, res) => {
	res.sendFile(
		path.join(__dirname, "..", "..", "frontend", "login-lf", "index.html")
	);
});

module.exports = router;
