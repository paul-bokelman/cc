import cookie from "cookie-signature";
import { env } from "~/lib/env";

const sessionSecret = env("SESSION_SECRET");

export const signCookie = (sid: string): string => {
  const signedCookie = cookie.sign(sid, sessionSecret);
  return signedCookie;
};
export const unsignCookie = (signedCookie: string): string => {
  const sid = cookie.unsign(signedCookie, sessionSecret);
  if (!sid) throw new Error("Invalid cookie");
  return sid;
};
