const {
  config: { Server, env },
} = require('../config');

const corsOptions =
  env === 'dev'
    ? {
        origin: (origin, callback) => {
          if (Server.whitelist.includes(origin) || !origin) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed'));
          }
        },
      }
    : {
        origin: function (origin, callback) {
          if (Server.whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
      };

module.exports = { corsOptions };
