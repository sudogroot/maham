import { db } from './client';
import { users, todos } from './schema';

async function seed() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    await db.delete(todos);
    await db.delete(users);

    // Insert users
    console.log('Adding users...');
    const [user1, user2] = await Promise.all([
      db.insert(users).values({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }).returning(),
      db.insert(users).values({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
      }).returning(),
    ]);

    // Insert todos
    console.log('Adding todos...');
    await Promise.all([
      db.insert(todos).values({
        title: 'Learn Fastify',
        description: 'Learn how to use Fastify with TypeScript',
        completed: 0,
        userId: user1[0].id,
      }),
      db.insert(todos).values({
        title: 'Learn Drizzle',
        description: 'Learn how to use Drizzle ORM with PostgreSQL',
        completed: 0,
        userId: user1[0].id,
      }),
      db.insert(todos).values({
        title: 'Learn tRPC',
        description: 'Learn how to use tRPC with Fastify',
        completed: 0,
        userId: user2[0].id,
      }),
    ]);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
}); 