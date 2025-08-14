const express = require("express");
const path = require("path");
const router = express.Router();

const checkinPath = path.join(
	__dirname,
	"../../frontend/login-baggage/index.html"
);

router.use(
	express.static(path.join(__dirname, "../../frontend/login-baggage"))
);

router.get("/baggage", (req, res) => {
	try {
		res.sendFile(checkinPath);
	} catch (err) {
		console.error("ERROR: ", err);
		res.status(500).send("Error encoutnered");
	}
});

module.exports = router;
