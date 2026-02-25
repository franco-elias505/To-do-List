const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

async function conectarDB() {
  try {
    await pool.query('SELECT 1');
    console.log(' Conectado a PostgreSQL');
  } catch (error) {
    console.error(' Error de conexión:', error.message);
    throw error;
  }
}

module.exports = { pool, conectarDB };