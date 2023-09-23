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
  app.get('/hello/:ID', (req, res) => {
    const ID  = req.params.ID
    res.send({status:200, message:ID});
  });
  app.get('/search', (req, res) => {
    const SEARCH = req.query.s;
    if (SEARCH !== "") {
      res.send({ status: 200, message: "ok", data: SEARCH });
    } else {
      res.status(500)
      res.send({ status: 500, error: true, message: "you have to provide a search" });
    }
  });

app.listen(3000);