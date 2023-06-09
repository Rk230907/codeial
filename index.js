const express = require('express');
const app = express();
const port = 8000;

const db = require('./config/mongoose');



app.listen(port, function(err){
    if(err){
        console.log('Error in connecting port 8000', err);
    }else{
        console.log('Server up and running to port 8000');
    }
})