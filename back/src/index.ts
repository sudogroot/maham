import Fastify, { FastifyServerOptions } from 'fastify';
import { z } from 'zod';
import cors from '@fastify/cors';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';
import { fastifyTRPCPlugin } from './trpc/plugin';
import todoRoutes from './routes/todos';
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

// Define schema with Zod
const GreetingQuery = z.object({
  name: z.string().optional()
});
type GreetingQueryType = z.infer<typeof GreetingQuery>;

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

// Example route with Zod for validation
server.get<{
  Querystring: GreetingQueryType,
  Reply: { greeting: string }
}>('/greeting', {
  schema: {
    querystring: zodToJsonSchema(GreetingQuery),
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
}, async (request) => {
  const query = GreetingQuery.parse(request.query);
  const { name = 'world' } = query;
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
