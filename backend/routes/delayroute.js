const express = require('express');
const path = require('path');
const router = express.Router();

const delayPath = path.join(__dirname,'../../frontend/login-delay/index.html');
router.use(express.static(path.join(__dirname,'../../frontend/login-delay')));
router.get('/delay',(req,res)=>{
    try{
        res.sendFile(delayPath);
    }
    catch(err){
        console.log("ERROR: ",err);
        res.status(500).send('Error encoutnered');
    }
    
})

module.exports = router;