/*
  Copyright (C) 2022 BeeReign
*/
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const passport = require('passport');

const {
  config: { Server },
} = require('./config');

const { corsOptions } = require('./middlewares/corsOptions');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/errorHandler');

const routes = require('./routes');
require('../utils/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 1500 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

class App {
  constructor() {
    this.app = express();
    this.app.use(limiter);
    this.port = Server.port;

    this.app.use(express.json());
    this.app.use(cors(corsOptions)); //enable url for cors in .env file

    this.app.use(passport.initialize({ session: false }));
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
      console.log(
        `Copyright (C) 2022 BeeReign \nThis app is running on http://127.0.0.1:${this.port}`
      );
    });
  }
}

module.exports = App;
