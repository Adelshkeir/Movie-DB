const express = require("express");
const req = require("express/lib/request");
const app = express();

let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let time = hours + ":" + minutes;

class Movie {
  constructor(title, year, rating) {
    this.title = title;
    this.year = year;
    this.rating = rating;
  }
}

const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];

app.get("/", (req, res) => {
  res.send({ status: 200, message: "Hello there" });
});

app.get("/test", (req, res) => {
  res.send({ status: 200, message: "ok" });
});

app.get("/time", (req, res) => {
  res.send({ status: 200, message: time });
});

app.get("/hello/:ID", (req, res) => {
  const ID = req.params.ID;
  res.send({ status: 200, message: ID });
});

app.get("/search", (req, res) => {
  const SEARCH = req.query.s;
  if (SEARCH !== "") {
    res.send({ status: 200, message: "ok", data: SEARCH });
  } else {
    res.status(500);
    res.send({
      status: 500,
      error: true,
      message: "you have to provide a search",
    });
  }
});

app.get("/movies/add", (req, res) => {
  if (!req.query.title || !req.query.year) {
    res.send({status:403,message: "you cannot create a movie without providing a title and a year",
    });
  }

  let movie = new Movie(
    req.query.title,
    req.query.year,
    req.query.rating ? req.query.rating : 4
  );

  movies.push(movie);
  res.send({ status: 200, message: movies });
});

app.get("/movies/get", (req, res) => {
  res.send({ status: 200, data: movies.map((movie) => movie.title) });
});
app.get("/movies/get/by-date", (req, res) => {
  const sortedMovies = movies.slice().sort((a, b) => a.year - b.year);
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/get/by-rating", (req, res) => {
  const sortedMovies = movies.slice().sort((a, b) => b.rating - a.rating);
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/get/by-title", (req, res) => {
  const sortedMovies = movies
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/get/id/:ID", (req, res) => {
  const ID = req.params.ID;
  let flag = false;
  for (let i = 0; i < movies.length; i++) {
    if (ID === movies[i].id) {
      flag = true;
      res.send({ status: 200, data: movies[i] });
      break;
    }
  }
  if (!flag) {
    res
      .status(404)
      .send({ status: 404, error: true, message: "Movie not found" });
  }
});

app.get("/movies/delete/:ID", (req, res) => {
  let ID = req.params.ID;
  ID = ID.replace(":", ""); // Remove leading colon from the ID
  let movieIndex = -1;

  for (let i = 0; i < movies.length; i++) {
    if (ID === movies[i].title) { 
      movieIndex = i;
      break;
    }
  }

  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1);
    res.send({ status: 200, data: movies });
  } else {
    res
      .status(404)
      .send({ status: 404, error: true, message: `The movie "${ID}" does not exist` });
  }
});
app.listen(3000);
