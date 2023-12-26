import type { Login, Register, Logout, Authorization } from "cc-common";
import type { MutationHook, Error } from "./query.utils";
import { useMutation } from "react-query";
import { mutation, query } from "./query.utils";

/* ---------------------------------- LOGIN --------------------------------- */
const login = mutation<Login>("/auth/login");
export const useLogin: MutationHook<Login> = (options) => {
  return useMutation<Login["payload"], Error, Omit<Login, "payload">>(login, options);
};

/* -------------------------------- REGISTER -------------------------------- */
const register = mutation<Register>("/auth/register");
export const useRegister: MutationHook<Register> = (options) => {
  return useMutation<Register["payload"], Error, Omit<Register, "payload">>(register, options);
};

/* --------------------------------- LOGOUT --------------------------------- */
const logout = mutation<Logout>("/auth/logout");
export const useLogout: MutationHook<Logout> = (options) => {
  return useMutation<Logout["payload"], Error, Omit<Logout, "payload">>(logout, options);
};

/* ------------------------------- AUTHORIZATION ------------------------------ */
export const authorize = query<Authorization>("/auth/authorized"); // export because used in withUser
