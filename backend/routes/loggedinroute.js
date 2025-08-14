const express = require('express');
const path = require('path');
const router = express.Router();

const loggedinPath = path.join(__dirname,'../../frontend/logged-in/index.html');
router.use(express.static(path.join(__dirname,'../../frontend/logged-in')));
router.get('/logged-in',(req,res)=>{
    try{
        res.sendFile(loggedinPath);
    }
    catch(err){
        console.log("ERROR: ",err);
        res.status(500).send('Error encoutnered');
    }
    
});

module.exports = router;