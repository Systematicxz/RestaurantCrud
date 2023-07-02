const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  logging: false,
});

module.exports = { db };

// dejo aca abajo lo que tiene que pegar en el env
// PORT=3000
// DB_PASSWORD=root
// DB_DIALECT=postgres
// DB_HOST=localhost
// DB_USERNAME=postgres
// DB_DATABASE=meals
