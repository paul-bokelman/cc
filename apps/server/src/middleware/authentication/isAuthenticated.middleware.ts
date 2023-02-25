import type { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Role } from '@prisma/client';
import { getSession } from 'lib/session';
import { unsignCookie } from 'lib/session/utils';
import { AuthenticatedUser } from 'types';

type isAuthenticatedOptions = {
  role: Role;
};

const roleHierarchy = ['MEMBER', 'SCHOLAR', 'MANAGER', 'ADMIN'];

//! Role should be string or array of strings
//TODO: Refactor (rename to isAuthorized)
//? client route authentication can pass through here to avoid duplicate code

export const isAuthenticated = (options: isAuthenticatedOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cookie: string = req.cookies?.['cc.sid'] ?? '';

    const unauthorized = (message?: string) => {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        authorized: false,
        message: message ?? ReasonPhrases.UNAUTHORIZED,
      });
    };

    const authorized = ({
      user,
      sid,
    }: {
      user: AuthenticatedUser;
      sid: string;
    }) => {
      req.user = user;
      req.sid = sid;
      return next();
    };

    (req.user as unknown) = null;
    (req.sid as unknown) = null;

    if (!cookie) return unauthorized('No account session');

    const { role } = options ?? {};

    try {
      const sid = unsignCookie(cookie);
      const user = await getSession(sid);

      if (!(roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(role)))
        return unauthorized('Insufficient role');

      return authorized({ user, sid });
    } catch (error) {
      if (error instanceof Error) return unauthorized(error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  };
};
