import Fastify, { FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';
import { fastifyTRPCPlugin } from './trpc/plugin';
import todoRoutes from './routes/todos';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

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

// Define a health check route
interface HealthResponse {
  status: string;
}

server.get<{
  Reply: HealthResponse
}>('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Define a route with typed request and response
interface GreetingQuerystring {
  name?: string;
}

interface GreetingResponse {
  greeting: string;
}

server.get<{
  Querystring: GreetingQuerystring,
  Reply: GreetingResponse
}>('/greeting', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          greeting: { type: 'string' }
        },
        required: ['greeting']
      }
    }
  }
}, async (request, reply) => {
  const { name = 'world' } = request.query;
  return { greeting: `Hello, ${name}!` };
});

// Start the server
const start = async () => {
  try {
    // Register CORS plugin
    await server.register(cors, {
      origin: true,
    });

    // Register tRPC plugin
    await server.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: { router: appRouter, createContext },
    });

    // Register todo routes
    await server.register(todoRoutes, { prefix: '/todos' });

    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 
