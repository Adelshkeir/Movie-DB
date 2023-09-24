const express = require ("express");
const req = require('express/lib/request');
const app = express();

let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let time = hours + ":" + minutes;

const movies = [
  { title: 'Jaws', year: 1975, rating: 8 },
  { title: 'Avatar', year: 2009, rating: 7.8 },
  { title: 'Brazil', year: 1985, rating: 8 },
  { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
];



app.get('/', (req, res) => {
  res.send({status:200, message:"Hello there"});
});

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


  app.get('/movies/add', (req, res) => {
    res.send({status:200, message:ID});
  });


  app.get('/movies/get', (req, res) => {
    res.send({status:200, data:movies.map(movie=>movie.title)});
  });
  app.get('/movies/get/by-date', (req, res) => {
    const sortedMovies = movies.slice().sort((a, b) => a.year - b.year);
    res.send({ status: 200, data: sortedMovies });
  });
  
  app.get('/movies/get/by-rating', (req, res) => {
    const sortedMovies = movies.slice().sort((a, b) => b.rating - a.rating);
    res.send({ status: 200, data: sortedMovies });
  });
  
  app.get('/movies/get/by-title', (req, res) => {
    const sortedMovies = movies.slice().sort((a, b) => a.title.localeCompare(b.title));
    res.send({ status: 200, data: sortedMovies });
  });


  app.get('/movies/edit', (req, res) => {
    res.send({status:200, message:ID});
  });


  app.get('/movies/delete', (req, res) => {
    res.send({status:200, message:ID});
  });





app.listen(3000);