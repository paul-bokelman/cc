import type { Authorization, Controller } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { getSession } from 'lib/session';
import { unsignCookie } from 'lib/session/utils';
import { formatResponse } from '~/lib/utils';

const roleHierarchy = ['MEMBER', 'SCHOLAR', 'MANAGER', 'ADMIN'];

const authorizationValidation = z.object({
  body: z.object({
    role: z.nativeEnum(Role),
    signedCookie: z.string(),
  }),
});

//! why the fuck won't axios send the cookie????

const authorizeHandler: Controller<Authorization> = async (req, res) => {
  const { success, error } = formatResponse<Authorization>(res);
  const signedCookie = req.body.signedCookie ?? ''; // wish I could get this from cookies...

  (req.user as unknown) = null;
  (req.sid as unknown) = null;

  if (!signedCookie) return error(StatusCodes.UNAUTHORIZED, 'No session');

  const { role = 'MEMBER' } = req.body ?? {};

  try {
    const sid = unsignCookie(signedCookie);
    const user = await getSession(sid);

    if (!(roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(role)))
      return error(StatusCodes.UNAUTHORIZED, 'Insufficient role');

    // req.user = user; // irrelevant in this file
    // req.sid = sid; // irrelevant in this file
    return success(StatusCodes.OK, { authorized: true });
  } catch (e) {
    if (e instanceof Error) return error(StatusCodes.UNAUTHORIZED, e.message);
    return error(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const authorize = { schema: authorizationValidation, handler: authorizeHandler };
