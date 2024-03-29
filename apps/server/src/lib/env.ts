import dotenv from "dotenv";

export const isProduction = process.env.NODE_ENV === "production";

dotenv.config({ path: ".env", debug: true });

const variables = [
  "NODE_ENV",
  "CLIENT_DOMAIN",
  "SERVER_URL",
  "SESSION_SECRET",
  "PORT",
  "REDIS_URL",
  "DB_URL",
  "SUBDOMAINS",
] as const;

type Variables = (typeof variables)[number];

const fetchVariable = (variable: Variables): string => {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not defined in .env.${isProduction ? "production" : "development"}`);
  }

  return process.env[variable] as string;
};

export const env = (variable: Variables): string => {
  return fetchVariable(variable);
};

export const initializeENV = (): void => {
  isProduction && console.log("\x1b[33m", "RUNNING IN PRODUCTION", "\x1b[0m");

  variables.forEach((variable) => {
    fetchVariable(variable);
  });

  return;
};
