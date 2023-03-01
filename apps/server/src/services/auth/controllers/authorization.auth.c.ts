import type { AuthenticatedUser, Controller } from '@/cc';
import { StatusCodes } from 'http-status-codes';
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

const authorizationValidation = z.object({
  role: z.nativeEnum(Role),
});

const authorizeHandler: Controller<Authorization> = async (req, res, next) => {
  const { error } = formatResponse<Authorization>(res);
  const cookie: string = req.cookies?.['cc.sid'] ?? '';

  console.log('cookie from isAuthorized', cookie);

  (req.user as unknown) = null;
  (req.sid as unknown) = null;

  if (!cookie) return error(StatusCodes.UNAUTHORIZED, 'No session');

  const { role = 'MEMBER' } = req.body ?? {}; // check options if not options then use body

  try {
    const sid = unsignCookie(cookie);
    const user = await getSession(sid);

    if (!(roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(role)))
      return error(StatusCodes.UNAUTHORIZED, 'Insufficient role');

    // authorized

    req.user = user;
    req.sid = sid;
    return next();
  } catch (e) {
    if (e instanceof Error) return error(StatusCodes.UNAUTHORIZED, e.message);
    return error(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const authorize = { schema: authorizationValidation, handler: authorizeHandler };
