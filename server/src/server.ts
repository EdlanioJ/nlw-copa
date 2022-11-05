import dotenv from 'dotenv';

dotenv.config();

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { userRoutes } from './routes/user';
import { pollRoutes } from './routes/poll';
import { guessRoutes } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});

fastify.register(authRoutes);
fastify.register(userRoutes);
fastify.register(pollRoutes);
fastify.register(guessRoutes);
fastify.register(gameRoutes);

async function bootstrap() {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 3333,
      host: '0.0.0.0',
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

bootstrap();
