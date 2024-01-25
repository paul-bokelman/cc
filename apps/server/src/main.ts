import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookies from "cookie-parser";
import { env, isProduction, initializeENV } from "~/lib/env";
import { services } from "~/services/router";
import { client, prisma } from "~/config";
import { AuthenticatedRequestPayload } from "./types";
import { formatResponse } from "./lib/utils";

initializeENV();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request extends AuthenticatedRequestPayload {
      school: string;
    }
  }
}

(async () =>
  await client.connect().catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  }))();

client.on("connect", () => console.log("Redis client connected"));

export const app: Express = express();

app.set("subdomain offset", 2);

app.use(bodyParser.json());
app.use(cookies());
app.use(cors({ origin: true, credentials: true }));

const subdomains = env("SUBDOMAINS").split(","); // should come from db?

// reject invalid subdomains
// app.use(async (req, res, next) => {
//   const { error } = formatResponse(res);

//   if (req.subdomains.length === 0) return error(400, "No subdomains");
//   if (req.subdomains.length !== 1) return error(400, "Too many subdomains");

//   const subdomain = req.subdomains[0];

//   if (!subdomains.includes(subdomain)) return error(400, "Invalid subdomain");

//   const school = await prisma.school.findUnique({ where: { name: subdomain }, select: { name: true } });
//   if (!school) return error(400, "School not found");

//   req.school = school.name;

//   next();
// });

app.use(async (req, res, next) => {
  // get school from first route param (e.g. /:school/users)
  const { error } = formatResponse(res);
  const school = req.path.split("/")[1];
  if (!school) return error(400, "No school");
  if (!subdomains.includes(school)) return error(400, "Invalid school");

  req.school = school;

  next();
});

app.use("/:school/", services);

const port = env("PORT") || 8000;

app.listen(port, () =>
  console.log(isProduction ? `\n${env("SERVER_URL")}` : `\nServer: http://api.localhost:${port} 🚀`)
);
