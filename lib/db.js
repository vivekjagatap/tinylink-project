// lib/db.js
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }   // 🔥 REQUIRED FOR NEON
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}
