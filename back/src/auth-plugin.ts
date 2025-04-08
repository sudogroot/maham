import FastifyBetterAuth from 'fastify-better-auth';
import fp from 'fastify-plugin';
import { auth } from './auth.js'


async function authPlugin(fastify: any) {
  await fastify.register(FastifyBetterAuth, { auth });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
});
