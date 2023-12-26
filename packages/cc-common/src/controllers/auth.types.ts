import { Role } from "@prisma/client";
import type { ToControllerConfig, AuthenticatedUser } from "../..";
import { z } from "zod";

/* --------------------------------- OPTIONS -------------------------------- */
export type AuthorizationOptions = {
  // applies to isAuthorized
  role: Role;
};

/* ---------------------------------- LOGIN --------------------------------- */
export type Login = ToControllerConfig<typeof loginSchema, AuthenticatedUser>;
export const loginSchema = z.object({ body: z.object({ username: z.string(), password: z.string() }) });

/* -------------------------------- REGISTER -------------------------------- */
export type Register = ToControllerConfig<typeof registerSchema, AuthenticatedUser>;
export const registerSchema = z.object({
  body: z.object({ username: z.string(), email: z.string(), password: z.string() }),
});

/* --------------------------------- LOGOUT --------------------------------- */
export type Logout = ToControllerConfig<typeof logoutSchema, { success: boolean }>;
export const logoutSchema = z.object({});

/* ------------------------------ AUTHORIZATION ----------------------------- */
export type Authorization = ToControllerConfig<typeof authorizationSchema, { authorized: true }>;
export const authorizationSchema = z.object({
  query: z.object({ role: z.nativeEnum(Role), sid: z.string() }),
});
