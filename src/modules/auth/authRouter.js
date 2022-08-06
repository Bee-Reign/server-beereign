const { Router } = require('express');
const passport = require('passport');

const AuthService = require('./authService');

const router = Router();
const authService = new AuthService();

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { sub } = req.user;
      const employee = await authService.getEmployeeProfile(sub);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const employee = req.user;
      res.status(200).json(authService.signToken(employee));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.recoveryPassword(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
