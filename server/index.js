const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { db } = require('./db');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes for auth
app.use('/auth', require('./auth'));

// api routes
app.use('/api', require('./api'));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// any remaining requests with an extension (.js, .css, etc.) send 404
// app.use((req, res, next) => {
//   if (path.extname(req.path).length) {
//     const err = new Error('Not found');
//     err.status = 404;
//     next(err);
//   } else {
//     next();
//   }
// });

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const PORT = 8080;

const startServer = async () => {
  try {
    if (process.env.SEED === 'true') {
      await seed();
    } else {
      await db.sync();
    }

    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
