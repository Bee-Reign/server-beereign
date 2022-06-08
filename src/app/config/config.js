require('dotenv').config();
// The project configuration
const config = {
  // --- Backend infraestructure enviroment
  // if it's different from dev, cors policies will block everything unless it's whitelisted
  env: process.env.NODE_ENV || 'dev',
  // --- Lenguage of the backend service
  locale: process.env.LOCALE || 'en_us',
  // --- Express and libs configuration
  Server: {
    port: process.env.PORT || 8080,
    whitelist: process.env.CORS_URL,
    frontEndUrl: process.env.FRONT_END_URL,
    jwtSecret: process.env.JWT_SECRET,
    recoverySecret: process.env.RECOVERY_SECRET,
  },
  // --- Database only work with PostgreSQL
  Database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  // --- Mail services
  Mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_USER_PASSWORD,
  },
};
module.exports = config;
