const express = require("express");
const router = express.Router();
const path = require("path");

const createNewLostAndFound = require("../../controllers/lostAndFoundController");

router.route("/").post(createNewLostAndFound);

module.exports = router;
