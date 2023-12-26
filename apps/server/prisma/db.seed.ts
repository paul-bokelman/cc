import { PrismaClient } from "@prisma/client";
import { tags, generateClub, generateUser } from "./data";
export const prisma = new PrismaClient();

export const allSchools = ["beckman", "school"];

async function main() {
  await prisma.tag.createMany({ data: tags.map((tag) => ({ name: tag })), skipDuplicates: true });

  for (const school of allSchools) {
    await prisma.school.create({ data: { name: school } });
    for (let i = 0; i < 10; i++) {
      await prisma.club.create({ data: generateClub(school) });
      await prisma.user.create({ data: await generateUser(school, i == 0 ? "ADMIN" : undefined) });
    }
    console.log("Generated data for:", school);
  }
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
