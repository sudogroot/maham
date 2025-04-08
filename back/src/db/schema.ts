import { pgTable, serial, text, varchar, timestamp, integer, uniqueIndex, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Note: User and session tables are now managed by better-auth
// This schema file only contains custom tables that are not managed by better-auth

// User settings - this can contain app-specific settings that better-auth doesn't manage
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().unique(), // This references the better-auth user ID
  theme: varchar('theme', { length: 50 }).default('light'),
  notifications: boolean('notifications').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Other custom tables can be added here
// For example, a todos table
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(), // This references the better-auth user ID
  title: text('title').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 
