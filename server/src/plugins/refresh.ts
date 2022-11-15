import { FastifyRequest } from 'fastify';

export async function refresh(request: FastifyRequest) {
  await request.refreshJwtVerify();
}
