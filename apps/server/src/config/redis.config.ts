import { createClient } from "redis";
import { env } from "lib";

export const client = createClient({
  url: env("REDIS_URL"),
});
