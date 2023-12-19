import type { Login, Register, Logout, Authorization } from "cc-common";
import type { MutationHook, Error } from "./query.utils";
import { useMutation } from "react-query";
import { mutation } from "./query.utils";

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
export const authorize = mutation<Authorization>("/auth/authorize"); // export because used in withUser
export const useAuthorization: MutationHook<Authorization> = (options) => {
  return useMutation<Authorization["payload"], Error, Omit<Authorization, "payload">>(authorize, options);
};
