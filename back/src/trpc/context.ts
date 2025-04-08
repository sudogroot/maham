import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { db } from '../db/client';

/**
 * Creates context for tRPC procedures
 * Includes request, response and database access
 */
export function createContext({ req, res }: CreateFastifyContextOptions) {
  return {
    req,
    res,
    db,
  };
}

// Export context type for use in other files
export type Context = inferAsyncReturnType<typeof createContext>; 