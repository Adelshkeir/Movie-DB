const express = require("express");
const app = express();

app.use(express.json()); // Required to parse JSON data

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

let movies = [
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
    res.status(500).send({
      status: 500,
      error: true,
      message: "you have to provide a search",
    });
  }
});

app.post("/movies", (req, res) => {
  const title = req.body.title;
  const year = req.body.year;
  const rating = req.body.rating || 4;

  if (!title || !year) {
    res.status(403).send({
      status: 403,
      message: "You cannot create a movie without providing a title and a year",
    });
    return;
  }

  const movie = new Movie(title, year, rating);
  movies.push(movie);

  res.send({ status: 200, message: "Movie added successfully", data: movie });
});

app.get("/movies", (req, res) => {
  res.send({ status: 200, data: movies.map((movie) => movie.title) });
});

app.get("/movies/by-date", (req, res) => {
  const sortedMovies = movies.slice().sort((a, b) => a.year - b.year);
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/by-rating", (req, res) => {
  const sortedMovies = movies.slice().sort((a, b) => b.rating - a.rating);
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/by-title", (req, res) => {
  const sortedMovies = movies
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/:ID", (req, res) => {
  const ID = req.params.ID;
  const movie = movies.find((movie) => movie.title === ID);

  if (movie) {
    res.send({ status: 200, data: movie });
  } else {
    res.status(404).send({ status: 404, error: true, message: "Movie not found" });
  }
});

app.delete("/movies/:ID", (req, res) => {
  const ID = req.params.ID;
  const movieIndex = movies.findIndex((movie) => movie.title === ID);

  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1);
    res.send({ status: 200, message: "Movie deleted successfully" });
  } else {
    res.status(404).send({
      status: 404,
      error: true,
      message: `The movie "${ID}" does not exist`,
    });
  }
});

app.put("/movies/:ID", (req, res) => {
  const ID = req.params.ID;
  const newTitle = req.body.title;
  const newRating = req.body.rating;

  const movieIndex = movies.findIndex((movie) => movie.title === ID);

  if (movieIndex !== -1) {
    const movie = movies[movieIndex];
    movie.title = newTitle || movie.title;
   movie.rating = newRating || movie.rating;

    res.send({ status: 200, message: "Movie updated successfully", data: movie });
  } else {
    res.status(404).send({ status: 404, error: true, message: "Movie not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});