import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import fetch from 'node-fetch';
import * as bcrypt from 'bcrypt';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';
import { refresh } from '../plugins/refresh';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/auth/refresh',
    {
      onRequest: [refresh],
    },
    async (request, reply) => {
      const refreshBody = z.object({
        sub: z.string(),
      });

      const { sub } = refreshBody.parse(request.user);

      const user = await prisma.user.findUnique({
        where: {
          id: sub,
        },
      });

      if (!user || !user.refreshToken)
        return reply.status(403).send({ message: 'access denied' });

      const authorization = request.headers['authorization'] as string;
      const [, token] = authorization.split(' ');

      const isValid = await bcrypt.compare(token.trim(), user.refreshToken);
      if (!isValid) return reply.status(403).send({ message: 'access denied' });

      const accessToken = fastify.jwt.access.sign(
        {
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        {
          sub: user.id,
          expiresIn: '15m',
        }
      );

      const refreshToken = fastify.jwt.refresh.sign(
        {},
        {
          sub: user.id,
          expiresIn: '30 days',
        }
      );

      const salt = bcrypt.genSaltSync(12);
      const hash = await bcrypt.hash(refreshToken, salt);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: hash,
        },
      });
      return {
        accessToken,
        refreshToken,
      };
    }
  );

  fastify.post(
    '/auth/logout',
    { onRequest: [authenticate] },
    async (request) => {
      const logoutBody = z.object({
        sub: z.string(),
      });

      const { sub } = logoutBody.parse(request.user);

      await prisma.user.update({
        where: { id: sub },
        data: { refreshToken: null },
      });
    }
  );

  fastify.get(
    '/me',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return {
        user: request.user,
      };
    }
  );

  fastify.post('/users', async (request, reply) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });

    const { access_token } = createUserBody.parse(request.body);

    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = await userResponse.json();
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const userInfo = userInfoSchema.parse(userData);
    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
        },
      });
    }

    const accessToken = fastify.jwt.access.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '15m',
      }
    );

    const refreshToken = fastify.jwt.refresh.sign(
      {},
      {
        sub: user.id,
        expiresIn: '30 days',
      }
    );

    const salt = bcrypt.genSaltSync(12);
    const hash = await bcrypt.hash(refreshToken, salt);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hash,
      },
    });
    return { accessToken, refreshToken };
  });
}
