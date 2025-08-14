const express = require('express');
const path = require('path');
const router = express.Router();

const welcomePath = path.join(__dirname, '../../frontend/welcome-page/index.html');

router.use(express.static(path.join(__dirname, '../../frontend/welcome-page')));

router.get('/welcome', (req, res) => {
    try {
        res.sendFile(welcomePath);
    } catch (err) {
        console.error("ERROR: ", err);
        res.status(500).send('Error encoutnered');
    }
});

module.exports = router;