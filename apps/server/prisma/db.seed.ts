import { PrismaClient } from "@prisma/client";
import select from "@inquirer/select";
import { confirm } from "@inquirer/prompts";
import { tags } from "./data";
import { generateUser } from "./data/generate";
import { getSchoolClubs, getTestClubs } from "./data/schools";
import schools from "./data/schools/schools.json";

export const prisma = new PrismaClient();

export const subdomains = process.env.SUBDOMAINS?.split(",") ?? [];

async function main() {
  const isProduction = process.env.NODE_ENV === "production";

  const schoolNames = Object.keys(schools).filter((school) => subdomains.includes(school));

  console.log("Running seed script...");
  if (isProduction) console.log("RUNNING IN PRODUCTION MODE, PROCEED WITH CAUTION");

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
      ...schoolNames.map((school) => ({ title: school, value: school })),
      { name: "exit", value: "exit" },
    ],
  });

  if (choice === "exit") return process.exit(0);

  const addAdmin = await confirm({ message: "Add admin?" });

  if (choice !== "all") {
    const schoolExists = await prisma.school.findUnique({ where: { name: choice } });

    if (schoolExists) {
      const deleteSchool = await confirm({ message: "School already exists, reset school (school, clubs and users)?" });
      if (!deleteSchool) return process.exit(0);
    }

    await prisma.club.deleteMany({ where: { school: { name: choice } } });
    await prisma.user.deleteMany({ where: { school: { name: choice } } });
    await prisma.school.deleteMany({ where: { name: choice } });
    await prisma.school.create({ data: { name: choice } });

    const clubs = await getSchoolClubs(choice);

    for (const club of clubs) {
      const exists = await prisma.club.findUnique({ where: { slug: club.slug } });
      if (exists) {
        console.log(`Club ${club.name} already exists, skipping...`);
        continue;
      }
      await prisma.club.create({ data: club });
    }

    if (addAdmin) {
      await prisma.user.create({ data: await generateUser(choice, "ADMIN") });
    }
  }

  if (choice === "all") {
    const deleteAll = await confirm({ message: "Action will delete all, continue?" });

    if (!deleteAll) return process.exit(0);

    await prisma.club.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();

    for (const school of schoolNames) {
      await prisma.school.create({ data: { name: school } });

      const clubs =
        school === "staging" || school === "testing" ? await getTestClubs(school) : await getSchoolClubs(school);

      for (const club of clubs) {
        const exists = await prisma.club.findUnique({ where: { slug: club.slug } });
        if (exists) {
          console.log(`Club ${club.name} already exists, skipping...`);
          continue;
        }
        await prisma.club.create({ data: club });
      }

      await prisma.user.create({ data: await generateUser(school, "ADMIN") });
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
