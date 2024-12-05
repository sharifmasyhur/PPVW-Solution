const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ppvw',
  password: 'pg',
  port: 5432,
});

module.exports = pool;
