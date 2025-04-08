import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { fastifyTRPCPlugin as originalFastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { AnyRouter } from '@trpc/server';
import { FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fp from 'fastify-plugin';

interface ExtendedFastifyTRPCPluginOptions<TRouter extends AnyRouter> 
  extends FastifyTRPCPluginOptions<TRouter> {
  prefix?: string;
}

export const fastifyTRPCPlugin = fp<ExtendedFastifyTRPCPluginOptions<AnyRouter>>(
  async (fastify: FastifyInstance, opts: ExtendedFastifyTRPCPluginOptions<AnyRouter>) => {
    const { prefix = '/trpc', ...trpcOptions } = opts;
    
    await fastify.register(originalFastifyTRPCPlugin, {
      prefix,
      ...trpcOptions,
    });
  },
  {
    name: 'fastify-trpc',
    fastify: '5.x',
  },
); 