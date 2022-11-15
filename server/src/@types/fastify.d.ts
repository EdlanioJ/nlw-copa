import fastify from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    accessJwtVerify<Decoded extends VerifyPayloadType>(
      options?: FastifyJwtVerifyOptions
    ): Promise<Decoded>;

    refreshJwtVerify<Decoded extends VerifyPayloadType>(
      options?: FastifyJwtVerifyOptions
    ): Promise<Decoded>;
  }
}
