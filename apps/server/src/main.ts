import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookies from "cookie-parser";
import { env, isProduction, initializeENV } from "~/lib/env";
import { schoolServices, generalServices } from "~/services/router";
import { client } from "~/config";
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
client.on("error", (e) => console.error(e)); // should notify admin
client.on("end", () => console.log("Redis client disconnected"));

export const app: Express = express();

app.set("subdomain offset", 2);

app.use(bodyParser.json());
app.use(cookies());
app.use(cors({ origin: true, credentials: true }));

const subdomains = env("SUBDOMAINS").split(","); // should come from db?

app.use("/general", generalServices);

app.use(async (req, res, next) => {
  const { error } = formatResponse(res);

  // don't allow general routes for schools
  if (req.path.startsWith("/general")) {
    return error(400, "Invalid school");
  }

  // get school from first route param (e.g. /:school/users)
  const school = req.path.split("/")[1];
  if (!school) return error(400, "No school");
  if (!subdomains.includes(school)) return error(400, "Invalid school");

  req.school = school;

  next();
});

app.use("/:school/", schoolServices);

const port = env("PORT") || 8000;

app.listen(port, () =>
  console.log(isProduction ? `\n${env("SERVER_URL")}` : `\nServer: http://api.localhost:${port} 🚀`)
);
