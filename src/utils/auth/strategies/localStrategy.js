const { Strategy } = require('passport-local');

const { AuthService } = require('../../../modules/auth');

const authService = new AuthService();
const LocalStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const employee = await authService.getEmployee(email, password);
      done(null, employee);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = LocalStrategy;
