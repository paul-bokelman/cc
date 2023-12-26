import type { CookieOptions } from "express";
import { nanoid } from "nanoid";
import { client } from "~/config";
import { env, isProduction } from "~/lib/env";
import { signCookie } from "~/lib/session/utils";

type GenerateSession = (config: { userId: string; school: string }) => Promise<GenerateSessionPayload>;
export type GenerateSessionPayload = { signature: string; options: CookieOptions };

export const generateSession: GenerateSession = async ({ userId, school }) => {
  if (!userId) throw new Error("User id is required");

  const sid = nanoid();

  const cookieOptions: CookieOptions = {
    domain: `.${school}.${env("CLIENT_DOMAIN")}`,
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // maxage: 24 * 60 * 60 * 1000, // https://stackoverflow.com/questions/61386688/safari-not-include-cookie-to-second-cors-request
    // secure: isProduction ? true : false,
    secure: true,
    sameSite: "none",
  };

  try {
    await client.set(`sessions:${sid}`, JSON.stringify({ userId, cookie: cookieOptions }));
    // set ttl
    // await client.expire(`sessions:${sid}`, 24 * 60 * 60 * 1000);
    const signedCookie = signCookie(sid);
    return { signature: signedCookie, options: cookieOptions };
  } catch (error) {
    throw new Error("Failed to generate session");
  }
};
