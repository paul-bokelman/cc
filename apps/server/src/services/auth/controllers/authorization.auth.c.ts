import type { AuthenticatedUser, Controller } from '@/cc';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { getSession } from 'lib/session';
import { unsignCookie } from 'lib/session/utils';
import { formatResponse } from '~/lib/utils';

type Authorization = {
  args: {
    body: AuthorizationOptions;
  };
  payload: undefined;
};

type AuthorizationOptions = {
  role?: Role;
};

const roleHierarchy = ['MEMBER', 'SCHOLAR', 'MANAGER', 'ADMIN'];

const authorizationValidation = z.object();

const authorizeHandler: Controller<Authorization> = async (req, res, next) => {
  const { error } = formatResponse<Authorization>(res);
  const cookie: string = req.cookies?.['cc.sid'] ?? '';

  console.log('cookie from isAuthenticated', cookie);

  const authorized = ({ user, sid }: { user: AuthenticatedUser; sid: string }) => {
    req.user = user;
    req.sid = sid;
    return next();
  };

  (req.user as unknown) = null;
  (req.sid as unknown) = null;

  if (!cookie) return error(StatusCodes.UNAUTHORIZED, 'No session');

  const { role = 'MEMBER' } = req.body ?? {}; // check options if not options then use body

  try {
    const sid = unsignCookie(cookie);
    const user = await getSession(sid);

    if (!(roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(role)))
      return error(StatusCodes.UNAUTHORIZED, 'Insufficient role');

    return authorized({ user, sid });
  } catch (e) {
    if (e instanceof Error) return error(StatusCodes.UNAUTHORIZED, e.message);
    return error(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const authorize = { schema: '', handler: authorizeHandler };
