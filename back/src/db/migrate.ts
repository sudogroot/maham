import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import dotenv from 'dotenv';

dotenv.config();

// Database migration script
async function main() {
  console.log('Starting database migration...');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }

  // Create a PostgreSQL connection pool
  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  // Run migrations
  await migrate(db, { migrationsFolder: 'drizzle/migrations' });

  console.log('Migration completed successfully');
  
  await pool.end();
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 