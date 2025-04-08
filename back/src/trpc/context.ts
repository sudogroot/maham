import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { db } from '../db/client';

/**
 * Creates context for tRPC procedures
 * Includes request, response and database access
 * Also verifies authentication for protected routes
 */
export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // Get the authorization header
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  
  // Get auth from the fastify instance
  const fastify = req.server;
  
  // Try to validate the session using better-auth
  let userId = null;
  let isAuthenticated = false;
  
  try {
    if ('auth' in fastify && token) {
      // Use fastify.auth if available
      const session = await fastify.auth.api.getSession({
        headers: req.headers,
      });
      
      if (session?.user) {
        isAuthenticated = true;
        userId = session.user.id;
      }
    }
  } catch (error) {
    console.error('Auth validation error:', error);
  }
  
  return {
    req,
    res,
    db,
    auth: {
      isAuthenticated,
      userId,
    },
  };
}

// Export context type for use in other files
export type Context = inferAsyncReturnType<typeof createContext>; 