import type { AuthenticatedUser } from "../..";
import type { ToControllerConfig } from "../..";
import * as z from "zod";

/* -------------------------------- GET USER -------------------------------- */
export type GetUser = ToControllerConfig<undefined, AuthenticatedUser>;
