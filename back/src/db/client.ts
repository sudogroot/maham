import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Get the connection URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString,
  ssl: false,
});

// Create a Drizzle client
export const db = drizzle(pool, { schema });
