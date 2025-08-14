const express = require('express');
const path = require('path');
const router = express.Router();

const lfPath = path.join(__dirname,'../../frontend/login-lf/index.html');
router.use(express.static(path.join(__dirname,'../../frontend/login-lf')));
router.get('/lostandfound',(req,res)=>{
    try{
        res.sendFile(lfPath);
    }
    catch(err){
        console.log("ERROR: ",err);
        res.status(500).send('Error encoutnered');
    }
    
})

module.exports = router;