const {
  config: { Server },
} = require('../config/config');

const corsOptions = {
  origin: (origin, callback) => {
    if (Server.whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed'));
    }
  },
};

module.exports = { corsOptions };
