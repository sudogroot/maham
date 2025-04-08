import { FastifyInstance } from 'fastify';

declare module 'fastify-better-auth' {
  import { FastifyPluginCallback } from 'fastify';

  interface FastifyBetterAuthOptions {
    auth: any; // We use 'any' here since we don't have proper types from better-auth
  }

  const fastifyBetterAuth: FastifyPluginCallback<FastifyBetterAuthOptions>;
  
  export default fastifyBetterAuth;
}

// Add better-auth types
declare module 'better-auth' {
  export interface BetterAuth {
    // Add any methods/properties you need
    // This is a placeholder since we don't have the actual types
    api: {
      getSession: (options: any) => Promise<any>;
      login: (options: any) => Promise<any>;
      register: (options: any) => Promise<any>;
    }
  }

  export function betterAuth(options: any): any;
}

// Add better-auth plugins
declare module 'better-auth/plugins' {
  export function organization(options?: any): any;
  export function twoFactor(options?: any): any;
}

// Extend FastifyInstance to include auth property
declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      api: {
        getSession: (options: any) => Promise<any>;
        login: (options: any) => Promise<any>;
        register: (options: any) => Promise<any>;
      }
    }
  }
} 