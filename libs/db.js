const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "5423",
  host: "localhost",
  port: 5432,
  database: "shake-game",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
