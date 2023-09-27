const express = require("express");
const req = require("express/lib/request");
const app = express(); // the server named app

let currentTime = new Date(); // here we used the curretTime  to get the real time based on your device
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let time = hours + ":" + minutes;

class Movie {  // this is a class named movie, i used it in when i want to add a movie, just use the "new" and it will be declared as object.
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
    res.status(500);
    res.send({
      status: 500,
      error: true,
      message: "you have to provide a search",
    });
  }
});


app.get("/movies/add", (req, res) => {
  if (!req.query.title || !req.query.year) { // here we check if the year or title are missing,if they are it will display the message
    res.send({status:403,message: "you cannot create a movie without providing a title and a year",
    });
  }


  let movie = new Movie(  //here instead of getting variables and using like 10 lines of code i just used the class and constructor, with the "new" following the name of the class u can declare it
    req.query.title,
    req.query.year,
    req.query.rating ? req.query.rating : 4
  );

  movies.push(movie);  // and then here we push it to the main array of objects :)
  res.send({ status: 200, message: movies }); // and here we display the main array after pushing, to check if it is pushed succefully
});

app.get("/movies/get", (req, res) => {
  res.send({ status: 200, data: movies.map((movie) => movie.title) });
});
app.get("/movies/get/by-date", (req, res) => {
  const sortedMovies = movies.slice().sort((a, b) => a.year - b.year); // here we used a and b to compare between each object year and sort them into sorten movies then display it
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/get/by-rating", (req, res) => {  // same as year but here by rating
  const sortedMovies = movies.slice().sort((a, b) => b.rating - a.rating);
  res.send({ status: 200, data: sortedMovies });
});

app.get("/movies/get/by-title", (req, res) => {
  const sortedMovies = movies
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));  // same but here we are comparing the titles, they will be displayed alphabetically
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

app.get("/movies/delete/:ID", (req, res) => {  // here we are using the user input and deleting the movie based on it, in this case i chose the title of the movie,
  let ID = req.params.ID;
  ID = ID.replace(":", ""); // Remove leading colon from the ID, it was dealing some problems for me with the comparison
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

app.get("/movies/update/:ID", (req, res) => {
  const ID = req.params.ID;
  const newTitle = req.query.title;

  let updatedMovies = [];

  for (let i = 0; i < movies.length; i++) {
    if (ID === movies[i].title) {
      const updatedMovie = {
        ...movies[i],
        title: newTitle ? newTitle : movies[i].title,
      };
      updatedMovies.push(updatedMovie);
    } else {
      updatedMovies.push(movies[i]);
    }
  }

  movies = [...updatedMovies];

  res.send({ status: 200, data: movies });
});

app.get("/movies/update/:ID", (req, res) => {
  const ID = req.params.ID;
  const newTitle = req.query.title;
  const newRating = req.query.rating;

  let updatedMovies = [];

  for (let i = 0; i < movies.length; i++) {
    if (ID === movies[i].title) {
      const updatedMovie = {
        ...movies[i],
        title: newTitle ? newTitle : movies[i].title,
        rating: newRating ? newRating : movies[i].rating,
      };
      updatedMovies.push(updatedMovie);
    } else {
      updatedMovies.push(movies[i]);
    }
  }

  movies = [...updatedMovies];

  res.send({ status: 200, data: movies });
});

app.listen(3000);
