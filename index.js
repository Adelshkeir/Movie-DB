const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

app.use(express.json());

let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let time = hours + ':' + minutes;

// Movie model
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  rating: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

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
      message: 'you have to provide a search',
    });
  }
});

app.post('/movies', (req, res) => {
  const { title, year, rating } = req.body;

  if (!title || !year) {
    res.status(403).send({
      status: 403,
      message: 'You cannot create a movie without providing a title and a year',
    });
    return;
  }

  const movie = new Movie({
    title,
    year,
    rating: rating || 4,
  });

  movie
    .save()
    .then((savedMovie) => {
      res.send({ status: 200, message: 'Movie added successfully', data: savedMovie });
    })
    .catch((error) => {
      res.status(500).send({ status: 500, error: true, message: error.message });
    });
});

app.get('/movies', (req, res) => {
  Movie.find()
    .then((movies) => {
      res.send({ status: 200, data: movies.map((movie) => movie.title) });
    })
    .catch((error) => {
      res.status(500).send({ status: 500, error: true, message: error.message });
    });
});

app.get('/movies/by-date', (req, res) => {
  Movie.find().sort({ year: 1 })
    .then((sortedMovies) => {
      res.send({ status: 200, data: sortedMovies });
    })
    .catch((error) => {
      res.status(500).send({ status: 500, error: true, message: error.message });
    });
});

app.get('/movies/by-rating', (req, res) => {
  Movie.find().sort({ rating: -1 })
    .then((sortedMovies) => {
      res.send({ status: 200, data: sortedMovies });
    })
    .catch((error) => {
      res.status(500).send({ status: 500, error: true, message: error.message });
    });
});

app.get('/movies/by-title', (req, res) => {
  Movie.find().sort({ title: 1 })
    .then((sortedMovies) => {
      res.send({ status: 200, data: sortedMovies });
    })
    .catch((error) => {
      res.status(500).send({ status: 500, error: true, message: error.message });
    });
});

app.get('/movies/:ID', (req, res) => {
  const ID = req.params.ID;

  Movie.findById(ID)
    .then((movie) => {
      if (movie) {
        res.send({ status: 200, data: movie });
      } else {
        res.status(404).send({ status: 404, error: true, message: 'Movie not found' });
      }
    })
    .catch((error) => {
      res.status(500).send({ status: 500, error: true, message: error.message });
    });
});

app.delete('/movies/:ID', (req, res) => {
  const ID = req.params.ID;

  Movie.findByIdAndDelete(ID)
    .then((deletedMovie) => {
      if (deletedMovie) {
        res.send({ status: 200, message: 'Movie deleted successfully' });
      } else {
        res.status(404).send({ status: 404, error: true, message: 'Movie not found' });
      }
    })
    .catch((error) => {
      res.status(500).send({ status: 500, error: true, message: error.message });
    });
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running');
    });
  })
  .catch((error) => {
    console.log('Failed to connect to MongoDB:', error.message);
  });