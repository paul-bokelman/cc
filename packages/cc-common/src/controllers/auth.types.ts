import { Role } from "@prisma/client";
import type { ToControllerConfig, AuthenticatedUser } from "../..";
import { z } from "zod";

/* ---------------------------------- LOGIN --------------------------------- */
export type Login = ToControllerConfig<typeof loginSchema, AuthenticatedUser>;
export const loginSchema = z.object({ body: z.object({ username: z.string(), password: z.string() }) });

/* -------------------------------- REGISTER -------------------------------- */
export type Register = ToControllerConfig<typeof registerSchema, { signedCookie: string }>;
export const registerSchema = z.object({
  body: z.object({ username: z.string(), email: z.string(), password: z.string() }),
});

/* --------------------------------- LOGOUT --------------------------------- */
export type Logout = ToControllerConfig<undefined, { success: boolean }>;

/* ------------------------------ AUTHORIZATION ----------------------------- */
export type Authorization = ToControllerConfig<typeof authorizationSchema, { authorized: true }>;
export const authorizationSchema = z.object({
  body: z.object({ role: z.nativeEnum(Role), signedCookie: z.string() }),
});

// export type AuthorizationOptions = {
//   // applies to isAuthorized
//   role?: Role;
// };
