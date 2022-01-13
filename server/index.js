const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = 8080;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
