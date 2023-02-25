import { PrismaClient } from '@prisma/client';
import { tags, clubs, users } from './data';
const prisma = new PrismaClient();

async function main() {
  await prisma.tag.createMany({
    data: tags.map((tag) => ({ name: tag })),
    skipDuplicates: true,
  });

  for (const club of clubs) {
    await prisma.club.create({ data: club });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
