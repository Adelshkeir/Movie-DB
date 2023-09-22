const express = require ("express");
const req = require('express/lib/request');
const app = express();

 app.get("/",(req,res) => {
 res.send("ok")
 
})

app.listen(3000)