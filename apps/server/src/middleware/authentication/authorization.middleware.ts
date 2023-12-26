import type { AuthenticatedUser, AuthorizationOptions } from "cc-common";
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getSession } from "~/lib/session";
import { unsignCookie } from "~/lib/session/utils";
import { formatResponse } from "~/lib/utils";

const roleHierarchy = ["STUDENT", "ADMIN"];

export const isAuthorized = async (
  cookie: string,
  options: AuthorizationOptions
): Promise<{ authorized: true; sid: string; user: AuthenticatedUser } | { authorized: false; message: string }> => {
  if (!cookie) return { authorized: false, message: "No session" };
  const { role = "STUDENT" } = options ?? {};
  try {
    const sid = unsignCookie(cookie);
    const user = await getSession(sid);
    if (!(roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(role)))
      return { authorized: false, message: "Insufficient role" };
    return { authorized: true, sid, user };
  } catch (e) {
    if (e instanceof Error) return { authorized: false, message: e.message };
    return { authorized: false, message: "Internal Server Error" };
  }
};

export const authorized = (options: AuthorizationOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = formatResponse(res);
    const cookie: string = req.cookies?.["cc.sid"] ?? "";

    const auth = await isAuthorized(cookie, options);

    if (!auth.authorized) return error(StatusCodes.UNAUTHORIZED, auth.message);

    req.user = auth.user;
    req.sid = auth.sid;

    return next();
  };
};
