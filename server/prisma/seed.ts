import { PrismaClient } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
async function main() {
  const prisma = new PrismaClient();

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      googleId: String(new ShortUniqueId({ length: 16 })()),
      avatarUrl: 'https://github.com/EdlanioJ.png',
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: '2022-12-02T20:00:00.930Z',
      firstTeamCountryCode: 'AR',
      secondTeamCountryCode: 'BR',
    },
  });

  await prisma.game.create({
    data: {
      date: '2022-12-04T20:00:00.930Z',
      firstTeamCountryCode: 'AO',
      secondTeamCountryCode: 'GE',
      guesses: {
        create: {
          firstTeamPoints: 1,
          secondTeamPoints: 7,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
