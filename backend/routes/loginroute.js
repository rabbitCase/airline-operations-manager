const express = require('express');
const path = require('path');
const router = express.Router();

const loginPath = path.join(__dirname, '../../frontend/staff-login/index.html');

router.use(express.static(path.join(__dirname, '../../frontend/staff-login')));

router.get('/login', (req, res) => {
    try {
        res.sendFile(loginPath);
    } catch (err) {
        console.error("ERROR: ", err);
        res.status(500).send('Error encoutnered');
    }
});

module.exports = router;