import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

import {
  defineConfig
} from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    ssl: false,
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "maham_dev",
    port: 5444,
  },
})
