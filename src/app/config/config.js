require('dotenv').config();
// The project configuration
const config = {
  env: process.env.NODE_ENV || 'dev',
  Server: {
    port: process.env.PORT || 8080,
    whitelist: process.env.CORS_URL,
    frontEndUrl: process.env.FRONT_END_URL,
    jwtSecret: process.env.JWT_SECRET,
    recoverySecret: process.env.RECOVERY_SECRET,
  },
  Database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  Mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_USER_PASSWORD,
  },
  Measurement: {
    es: '"GALONES", "GRAMOS", "KILOGRAMOS", "LIBRAS", "LITROS", "ONZAS", "UNIDADES"',
    en_us:
      '"GALLONS", "GRAMS", "KILOGRAMS", "POUNDS", "LITERS", "OUNCES", "UNITS"',
  },
  TypeOfSale: {
    es: '"CONTADO", "CRÉDITO"',
    en_us: '"CASH", "CREDIT"',
  },
};
module.exports = { config };
