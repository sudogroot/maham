import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';
import { auth, authHelpers } from '../auth/config';

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Export base router and procedure
export const router = t.router;
export const publicProcedure = t.procedure;

// Create a middleware for protected routes
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.isAuthenticated || ctx.auth.userId === null) {
    throw new Error('Not authenticated');
  }
  return next({
    ctx: {
      ...ctx,
      // Add user ID from auth result with type assertion
      userId: ctx.auth.userId as number,
    },
  });
});

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(isAuthenticated);

// Create the main router
export const appRouter = router({
  // User info (protected, requires session)
  user: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      try {
        const userId = ctx.userId;
        // userId is now guaranteed to be a number due to the middleware
        
        // Get user from better-auth
        const user = await authHelpers.user.get({ userId });
        return user;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to get user');
      }
    }),
    
    // Get user settings
    settings: protectedProcedure.query(async ({ ctx }) => {
      try {
        const userId = ctx.userId;
        // userId is now guaranteed to be a number due to the middleware
        
        // Get user settings from the database
        // This would be your custom settings logic
        return {
          theme: 'light',
          notifications: true
        };
      } catch (error) {
        console.error('Error fetching user settings:', error);
        throw new Error('Failed to get user settings');
      }
    }),
  }),
  
  // Organization endpoints
  organization: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        // Get organizations for the current user
        const organizations = await authHelpers.organization.listByUser({ userId: ctx.userId });
        return organizations;
      } catch (error) {
        console.error('Error fetching organizations:', error);
        throw new Error('Failed to get organizations');
      }
    }),
    
    create: protectedProcedure
      .input(z.object({ name: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Create a new organization
          const organization = await authHelpers.organization.create({
            userId: ctx.userId,
            name: input.name
          });
          return organization;
        } catch (error) {
          console.error('Error creating organization:', error);
          throw new Error('Failed to create organization');
        }
      }),
  }),
  
  // Two-factor authentication endpoints
  twoFactor: router({
    enable: protectedProcedure.mutation(async ({ ctx }) => {
      try {
        // Enable 2FA for the current user
        const result = await authHelpers.twoFactor.enable({ userId: ctx.userId });
        return result;
      } catch (error) {
        console.error('Error enabling 2FA:', error);
        throw new Error('Failed to enable 2FA');
      }
    }),
    
    disable: protectedProcedure.mutation(async ({ ctx }) => {
      try {
        // Disable 2FA for the current user
        await authHelpers.twoFactor.disable({ userId: ctx.userId });
        return { success: true };
      } catch (error) {
        console.error('Error disabling 2FA:', error);
        throw new Error('Failed to disable 2FA');
      }
    }),
    
    verify: protectedProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Verify 2FA code
          const result = await authHelpers.twoFactor.verify({
            userId: ctx.userId,
            code: input.code
          });
          return result;
        } catch (error) {
          console.error('Error verifying 2FA code:', error);
          throw new Error('Failed to verify 2FA code');
        }
      }),
  }),
});

// Export type router type signature
export type AppRouter = typeof appRouter; 