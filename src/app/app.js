const express = require('express');
const cors = require('cors');

const {
  config: { Server },
} = require('./config/config');

const { corsOptions } = require('./middlewares/corsOptions');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/errorHandler');

const routes = require('./routes');

class App {
  constructor() {
    this.app = express();
    this.port = Server.port;

    this.app.use(express.json());
    this.app.use(cors(corsOptions)); //enable url for cors in .env file

    this.app.use('/', routes); //routes

    this.middlewares();
  }

  middlewares() {
    this.app.use(logErrors);
    this.app.use(boomErrorHandler);
    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`This app is running on http://127.0.0.1:${this.port}`);
    });
  }
}

module.exports = App;
