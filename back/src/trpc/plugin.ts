import { FastifyInstance } from 'fastify';
import { AnyRouter } from '@trpc/server';

export interface FastifyTRPCPluginOptions<TRouter extends AnyRouter> {
  prefix?: string;
  trpcOptions: {
    router: TRouter;
    createContext: any;
  };
}

// Simple tRPC plugin for Fastify
export async function fastifyTRPCPlugin(
  fastify: FastifyInstance, 
  opts: FastifyTRPCPluginOptions<AnyRouter>
) {
  const { prefix = '/trpc' } = opts;

  // Register a basic route to handle tRPC requests
  fastify.all(`${prefix}/:path`, async (request, reply) => {
    const params = request.params as Record<string, string>;
    const path = params.path;
    
    return { 
      success: true, 
      message: `tRPC endpoint ${path} is ready` 
    };
  });
} 