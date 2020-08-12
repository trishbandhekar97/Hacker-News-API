const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const axios = require('axios');

const { comments } = require('./handlers/comments');
const { topStories } = require('./handlers/topStories');
const { pastStories } = require('./handlers/pastStories');
const connectDB = require('../db/db');

const client = require('../db/redis');

function cache(req, res, next) {
  if (req.params.id === undefined) {
    client.get('topStories', (err, data) => {
      if (err) throw err;

      if (data !== null) {
        res.send({
          success: true,
          data: JSON.parse(data),
        });
      } else {
        next();
      }
    });
  } else {
    client.get(req.params.id, (err, data) => {
      if (err) throw err;

      if (data !== null) {
        res.send({
          success: true,
          data: JSON.parse(data),
        });
      }
    });

    next();
  }
}

connectDB();

const app = express();

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'HackerNews API',
  });
});

app.get('/top-stories', cache, topStories);
app.get('/comments/:id', cache, comments);
app.get('/past-stories', pastStories);

module.exports = app;
