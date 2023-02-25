import type { AuthenticatedUser } from '.';

/* ---------------------------------- LOGIN --------------------------------- */

export type Login = {
  args: {
    body: {
      username: string;
      password: string;
    };
  };
  payload: {
    user: AuthenticatedUser;
    signedCookie: string;
  };
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
