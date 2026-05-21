import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Establish database pool with environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/syncrig_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('[SYNCRIG] Connected to the PostgreSQL database.');
});

pool.on('error', (err) => {
  console.error('[SYNCRIG] Unexpected error on idle database client', err);
  process.exit(-1);
});

export default {
  query: (text, params) => pool.query(text, params),
  pool
};
