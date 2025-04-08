import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Export base router and procedure
export const router = t.router;
export const publicProcedure = t.procedure;

// Create the main router
export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string().optional()
      })
    )
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