import dotenv from 'dotenv';

dotenv.config();

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { userRoutes } from './routes/user';
import { poolRoutes } from './routes/pool';
import { guessRoutes } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: true,
});

server.register(jwt, {
  secret: process.env.JWT_SECRET,
  namespace: 'access',
});

server.register(jwt, {
  secret: process.env.JWT_REFRESH_SECRET,
  namespace: 'refresh',
});

server.register(authRoutes);
server.register(userRoutes);
server.register(poolRoutes);
server.register(guessRoutes);
server.register(gameRoutes);

async function bootstrap() {
  try {
    await server.listen({
      port: Number(process.env.PORT) || 3333,
      host: '0.0.0.0',
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

bootstrap();
