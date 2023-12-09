import { PrismaClient } from "@prisma/client";
import { env, isProduction } from "~/lib/env";

interface Global {
  prisma: PrismaClient;
}

const prisma =
  (global as unknown as Global).prisma ||
  (new PrismaClient({
    // errorFormat: "minimal",
    log: isProduction ? ["error"] : ["warn", "error"],
    datasources: {
      db: {
        url: env("DB_URL"), // always defined because of preflightENV
      },
    },
  }) as PrismaClient);

if (!isProduction) (global as unknown as Global).prisma = prisma;

export { prisma }; // exporting Prisma namespace is kinda hacky, but it's cleaner for getting types for PrismaClientKnownRequestError
