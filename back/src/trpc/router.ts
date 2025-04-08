import { initTRPC } from '@trpc/server';
import { Context } from './context';

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Export base router and procedure
export const router = t.router;
export const publicProcedure = t.procedure;

// Define input types manually instead of using Zod
type HelloInput = {
  name?: string;
};

// Create the main router
export const appRouter = router({
  hello: publicProcedure
    // Parse input manually instead of using Zod schema
    .input<HelloInput>((value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Invalid input: Expected object');
      }
      
      // Type checking for name property
      if ('name' in value && value.name !== undefined && typeof value.name !== 'string') {
        throw new Error('Invalid input: name must be a string');
      }
      
      return value as HelloInput;
    })
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'world'}!`,
      };
    }),
  
  // Add more procedures here
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter; 