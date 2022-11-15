import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      avatarUrl: string;
    };
  }

  interface JWT {
    access: {
      sign(payload: SignPayloadType, options?: Partial<SignOptions>): string;
    };

    refresh: {
      sign(payload: SignPayloadType, options?: Partial<SignOptions>): string;
    };
  }
}
