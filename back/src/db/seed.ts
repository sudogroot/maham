import { db } from './client';
// import { userSettings } from './schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    // await db.delete(userSettings);

    // Create admin user
    // console.log('Adding admin user...');
    // const [adminUser] = await db.insert(users).values({
    //   name: 'Admin User',
    //   email: 'admin@example.com',
    //   passwordHash: await bcrypt.hash('Password123!', 10),
    //   role: 'admin',
    //   emailVerified: true,
    // }).returning();
    //
    // // Create regular user
    // console.log('Adding regular user...');
    // const [regularUser] = await db.insert(users).values({
    //   name: 'Regular User',
    //   email: 'user@example.com',
    //   passwordHash: await bcrypt.hash('Password123!', 10),
    //   role: 'user',
    //   emailVerified: true,
    // }).returning();

    // Add user settings
    console.log('Adding user settings...');
    // await Promise.all([
    //   db.insert(userSettings).values({
    //     userId: adminUser.id,
    //     theme: 'dark',
    //     notifications: true,
    //   }),
    //   db.insert(userSettings).values({
    //     userId: regularUser.id,
    //     theme: 'light',
    //     notifications: false,
    //   }),
    // ]);

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
