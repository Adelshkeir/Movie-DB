const express = require ("express");
const req = require('express/lib/request');
const app = express();

let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let time = hours + ":" + minutes;

app.get('/test', (req, res) => {
    res.send({status:200, message:"ok"});
  });
  app.get('/time', (req, res) => {
    res.send({status:200, message:time});
  });

app.listen(3000);