import Fastify, { FastifyServerOptions } from 'fastify';
import { z } from 'zod';
import cors from '@fastify/cors';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';
import authPlugin from './auth/plugin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Create Fastify server with generic types
const serverOptions: FastifyServerOptions = {
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
};

// Create server with explicit generic types
const server = Fastify(serverOptions);

// Define a health check route with native Fastify validation
interface HealthResponse {
  status: string;
}

server.get<{
  Reply: HealthResponse
}>('/health', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' }
        },
        required: ['status']
      }
    }
  }
}, async (request, reply) => {
  return { status: 'ok' };
});

// Helper function to convert Zod schema to Fastify JSON schema
function zodToJsonSchema(schema: z.ZodObject<any>) {
  return {
    type: 'object',
    properties: Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]: [string, any]) => {
        let type = 'string';
        if (value._def.typeName === 'ZodNumber') type = 'number';
        if (value._def.typeName === 'ZodBoolean') type = 'boolean';
        return [key, { type }];
      })
    )
  };
}

// Start the server
const start = async () => {
  try {
    // Register CORS plugin
    await server.register(cors, {
      origin: true,
    });
    
    // Register tRPC routes - simplified for now
    // In production, you should use the proper @trpc/server/adapters/fastify adapter
    server.all('/trpc/:path', async (request, reply) => {
      try {
        return { 
          success: true, 
          message: 'tRPC endpoint is ready. Use @trpc/server/adapters/fastify for proper implementation.' 
        };
      } catch (error) {
        console.error('Error in tRPC route:', error);
        reply.status(500).send({ error: 'Internal server error' });
      }
    });
    
    // Register Better Auth plugin
    await server.register(authPlugin);
    console.log('Better Auth plugin registered successfully');
    
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 
