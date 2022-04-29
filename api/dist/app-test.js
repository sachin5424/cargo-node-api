const express = require('express');
const app = express();

app.use('*', (req, res, next)=>{
    console.log('Hello');
    next();
})

app.get('/', (req, res)=>{
    res.send("Root url")
})

app.listen(3003, (err)=>{
    if(!err){
        console.log('Server running on 3003');
    } else{
        console.log('Error while starting the server');
        console.log('Reason:', err.message);
    }
})