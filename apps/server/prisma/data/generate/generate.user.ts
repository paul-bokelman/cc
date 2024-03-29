import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { customAlphabet as nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { prisma } from "../../db.seed";
import schools from "../schools/schools.json";

// can't use bc of tsconfig
const generateCCID = async (): Promise<string> => {
  const ccid = nanoid("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6)();
  const user = await prisma.user.findUnique({ where: { ccid } });
  if (user) return generateCCID();
  return ccid;
};

export const generateUser = async (school: string, role?: Role): Promise<Prisma.UserCreateInput> => {
  const isAdmin = role === "ADMIN";
  const { username, password } = schools[school as keyof typeof schools].admin;
  return Prisma.validator<Prisma.UserCreateInput>()({
    school: { connect: { name: school } },
    ccid: await generateCCID(),
    username: isAdmin ? username : faker.internet.userName(),
    avatar: null,
    email: isAdmin ? `${school}-admin@gmail.com` : faker.internet.email(),
    password: bcrypt.hashSync(password, 10),
    role: isAdmin ? "ADMIN" : "STUDENT",
  });
};
