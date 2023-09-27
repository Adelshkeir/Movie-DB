const express = require('express');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');

app.use(express.json());

let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let time = hours + ':' + minutes;

const users = [
  { username: 'John', password: '1234' },
  { username: 'Jane', password: '5678' }
];

const movies = [];

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send({ status: 401, error: true, message: 'Unauthorized' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send({ status: 401, error: true, message: 'Invalid token' });
  }
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.send({ status: 200, message: 'Login successful', token });
  } else {
    res.status(401).send({ status: 401, error: true, message: 'Invalid credentials' });
  }
});

app.get('/', (req, res) => {
  res.send({ status: 200, message: 'Hello there' });
});

app.get('/test', (req, res) => {
  res.send({ status: 200, message: 'ok' });
});

app.get('/time', (req, res) => {
  res.send({ status: 200, message: time });
});

app.get('/hello/:ID', (req, res) => {
  const ID = req.params.ID;
  res.send({ status: 200, message: ID });
});

app.get('/search', (req, res) => {
  const SEARCH = req.query.s;
  if (SEARCH !== '') {
    res.send({ status: 200, message: 'ok', data: SEARCH });
  } else {
    res.status(500).send({
      status: 500,
      error: true,
      message: 'You have to provide a search'
    });
  }
});

app.post('/movies', authenticateUser, (req, res) => {
  const { title, year, rating } = req.body;

  if (!title || !year) {
    res.status(403).send({
      status: 403,
      message: 'You cannot create a movie without providing a title and a year'
    });
    return;
  }

  const movie = {
    title,
    year,
    rating: rating || 4
  };

  movies.push(movie);

  res.send({ status: 200, message: 'Movie added successfully', data: movie });
});

app.get('/movies', (req, res) => {
  res.send({ status: 200, data: movies });
});

app.get('/movies/by-date', (req, res) => {
  const sortedMovies = [...movies].sort((a, b) => a.year - b.year);
  res.send({ status: 200, data: sortedMovies });
});

app.get('/movies/by-rating', (req, res) => {
  const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating);
  res.send({ status: 200, data: sortedMovies });
});

app.get('/movies/by-title', (req, res) => {
  const sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
  res.send({ status: 200, data: sortedMovies });
});

app.get('/movies/:ID', (req, res) => {
  const ID = req.params.ID;
  const movie = movies.find(movie => movie.title === ID);

  if (movie) {
    res.send({ status: 200, data: movie });
  } else {
    res.status(404).send({ status: 404, error: true, message: 'Movie not found' });
  }
});

app.put('/movies/:ID', authenticateUser, (req, res) => {
  const ID = req.params.ID;
  const updatedMovie = req.body;

  const movieIndex = movies.findIndex(movie => movie.title === ID);

  if (movieIndex !== -1) {
    movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie };
    res.send({ status: 200, message: 'Movie updated successfully', data: movies[movieIndex] });
  } else {
    res.status(404).send({ status: 404, error: true, message: 'Movie not found' });
  }
});

app.delete('/movies/:ID', authenticateUser, (req, res) => {
  const ID = req.params.ID;

  const movieIndex = movies.findIndex(movie => movie.title === ID);

  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1);
    res.send({ status: 200, message: 'Movie deleted successfully' });
  } else {
    res.status(404).send({ status: 404, error: true, message: 'Movie not found' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});