const express = require('express');
const path = require('path');
const router = express.Router();

const regPath = path.join(__dirname,'../../frontend/staff-registration/index.html');
router.use(express.static(path.join(__dirname,'../../frontend/staff-registration')));
router.get('/register',(req,res)=>{
    try{
        res.sendFile(regPath);
    }
    catch(err){
        console.log("ERROR: ",err);
        res.status(500).send('Error encoutnered');
    }
    
})

module.exports = router;