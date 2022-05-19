const { Strategy, ExtractJwt } = require('passport-jwt');

const {
  config: { Server },
} = require('../../../app/config');

const JwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Server.jwtSecret,
  },
  (payload, done) => {
    return done(null, payload);
  }
);

module.exports = JwtStrategy;
