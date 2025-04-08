import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { auth } from './config';
// @ts-ignore - Import FastifyBetterAuth with ts-ignore as we've defined types in custom.d.ts
import FastifyBetterAuth from 'fastify-better-auth';

// Create a plugin that registers better-auth with Fastify
async function authPlugin(fastify: FastifyInstance) {
  // Register the fastify-better-auth plugin with our auth instance
  await fastify.register(FastifyBetterAuth, { auth });
  
  // Add helper endpoint to verify that auth is working
  fastify.get('/auth/status', async (request, reply) => {
    try {
      // Check if we can access the auth functionality
      // The auth property should be added by the fastify-better-auth plugin
      if ('auth' in fastify) {
        return {
          status: 'ok',
          message: 'Better Auth is properly configured'
        };
      } else {
        return {
          status: 'error',
          message: 'Better Auth is not properly registered with Fastify'
        };
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      return {
        status: 'error',
        message: 'Error accessing auth functionality'
      };
    }
  });

  // Log successful initialization
  console.log('Better Auth plugin initialized with:');
  console.log('- Email/Password authentication: Enabled');
  console.log('- Two-Factor authentication: Enabled');
  console.log('- Organization management: Enabled');
}

// Export the plugin using fastify-plugin to make decorations available across the application
export default fp(authPlugin, {
  name: 'auth-plugin',
  dependencies: ['@fastify/cors']
}); 