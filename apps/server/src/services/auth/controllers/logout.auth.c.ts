import type { Controller, Logout } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { destroySession } from '~/lib/session';
import { formatResponse, handleControllerError } from '~/lib/utils';

//   args: undefined;
//   payload: {
//     success: boolean;
//   };
// };

export const logoutHandler: Controller<Logout> = async (req, res) => {
  const { error, success } = formatResponse(res);
  const sid = req.sid;

  if (!sid) return error(StatusCodes.BAD_REQUEST, 'Missing session Id');

  try {
    await destroySession(sid);
    return success(StatusCodes.OK, { success: true }, { clear: true });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const logout = { handler: logoutHandler };
