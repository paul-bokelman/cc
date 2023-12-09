import type { Role } from '@prisma/client';
import type { AuthenticatedUser } from '.';

/* ---------------------------------- LOGIN --------------------------------- */

export type Login = {
  args: {
    body: {
      username: string;
      password: string;
    };
  };
  payload: AuthenticatedUser;
};

/* -------------------------------- REGISTER -------------------------------- */

export type Register = {
  args: {
    body: {
      username: string;
      email: string;
      password: string;
    };
  };
  payload: {
    signedCookie: string;
  };
};

/* --------------------------------- LOGOUT --------------------------------- */

export type Logout = {
  args: undefined;
  payload: {
    success: boolean;
  };
};

/* ------------------------------ AUTHORIZATION ----------------------------- */

export type Authorization = {
  args: {
    body: AuthorizationOptions & { signedCookie: string };
  };
  payload: { authorized: true };
};

export type AuthorizationOptions = {
  // applies to isAuthorized
  role?: Role;
};
