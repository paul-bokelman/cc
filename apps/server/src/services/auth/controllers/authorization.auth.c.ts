import type { Controller } from 'types';
import type { Authorization } from 'types/auth';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { getSession } from 'lib/session';
import { unsignCookie } from 'lib/session/utils';

const roleHierarchy = ['MEMBER', 'SCHOLAR', 'MANAGER', 'ADMIN'];

export const authorization: Controller<Authorization> = async (req, res) => {
  const cookie: string = req.cookies?.['cc.sid'] ?? '';

  const unauthorized = (message?: string) => {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      authorized: false,
      message: message ?? ReasonPhrases.UNAUTHORIZED,
    });
  };

  const authorized = () => {
    return res.status(StatusCodes.OK).json({
      authorized: true,
      message: ReasonPhrases.OK,
    });
  };

  if (!cookie) return unauthorized('No account session');

  const { role, allow, block } = req.body ?? {};

  try {
    const sid = unsignCookie(cookie);
    const user = await getSession(sid);

    if (user.role === 'ADMIN') return authorized();

    if (role) {
      if (!(roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(role)))
        return unauthorized('Insufficient role');
    }

    return authorized();
  } catch (e) {
    if (e instanceof Error) return unauthorized(e.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      authorized: false,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
