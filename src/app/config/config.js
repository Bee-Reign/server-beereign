require('dotenv').config();
// The project configuration
const config = {
  env: process.env.NODE_ENV || 'dev',
  Server: {
    port: process.env.PORT || 3000,
    whitelist: [
      'http://localhost:3000',
      process.env.CORS_URL || 'https://example.example',
    ],
    jwtSecret: process.env.JWT_SECRET,
  },
  Database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  Enum: {
    spanish:
      '"GALONES", "GRAMOS", "KILOGRAMOS", "LIBRAS", "LITROS", "ONZAS", "UNIDADES"',
  },
};
module.exports = { config };
