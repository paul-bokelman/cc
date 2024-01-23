import { PrismaClient } from "@prisma/client";
import select from "@inquirer/select";
import { confirm } from "@inquirer/prompts";
import { tags } from "./data";
import { generateUser } from "./data/generate";
import { get } from "./data/schools";

export const prisma = new PrismaClient();

export const allSchools = process.env.SUBDOMAINS?.split(",") ?? [];

async function main() {
  const addTags = await confirm({ message: "Add tags?" });

  if (addTags) {
    await prisma.tag.deleteMany();
    await prisma.tag.createMany({ data: tags.map((tag) => ({ name: tag })), skipDuplicates: true });
    console.log("Added tags");
  }

  const choice = await select({
    message: "Choose a school",
    choices: [
      { name: "all", value: "all" },
      ...allSchools.map((school) => ({ title: school, value: school })),
      { name: "exit", value: "exit" },
    ],
  });

  if (choice === "exit") return process.exit(0);

  const addUsers = await confirm({ message: "Add users?" });
  const generateDummyData = await confirm({ message: "Generate dummy data?" });

  if (choice !== "all") {
    const schoolExists = await prisma.school.findUnique({ where: { name: choice } });

    if (schoolExists) {
      const deleteSchool = await confirm({ message: "School already exists, reset clubs and users?" });
      if (!deleteSchool) return process.exit(0);
    }

    await prisma.club.deleteMany({ where: { school: { name: choice } } });
    await prisma.user.deleteMany({ where: { school: { name: choice } } });
    await prisma.school.deleteMany({ where: { name: choice } });
    await prisma.school.create({ data: { name: choice } });

    const key = (generateDummyData ? "school" : choice) as keyof typeof get;

    const clubs = await get[key]();

    for (const club of clubs) {
      const exists = await prisma.club.findUnique({ where: { slug: club.slug } });
      if (exists) {
        console.log(`Club ${club.name} already exists, skipping...`);
        continue;
      }
      await prisma.club.create({ data: club });
    }

    if (addUsers) {
      for (let i = 0; i < 10; i++) {
        await prisma.user.create({ data: await generateUser(choice, i == 0 ? "ADMIN" : undefined) });
      }
    }
  }

  if (choice === "all") {
    const deleteAll = await confirm({ message: "Action will delete all, continue?" });

    if (!deleteAll) return process.exit(0);

    await prisma.club.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();

    for (const school of allSchools) {
      await prisma.school.create({ data: { name: school } });

      const key = (generateDummyData ? "school" : school) as keyof typeof get;
      const clubs = await get[key]();

      for (const club of clubs) {
        const exists = await prisma.club.findUnique({ where: { slug: club.slug } });
        if (exists) {
          console.log(`Club ${club.name} already exists, skipping...`);
          continue;
        }
        await prisma.club.create({ data: club });
      }

      if (addUsers) {
        for (let i = 0; i < 10; i++) {
          await prisma.user.create({ data: await generateUser(school, i == 0 ? "ADMIN" : undefined) });
        }
      }
    }
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
