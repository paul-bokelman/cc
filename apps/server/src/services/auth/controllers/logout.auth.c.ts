import type { Controller } from 'types';
import type { Logout } from '@/cc';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { env } from '~/lib/env';
import { destroySession } from '~/lib/session';
import { formatResponse, handleControllerError } from '~/lib/utils';

// type Logout = {
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
  } catch (e) {
    return error(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to destroy session'
    );
  }

  try {
    await axios.post(`${env('CLIENT_URL')}/api/clearCookies`); // cock

    return success(StatusCodes.OK, { success: true });

    // return res
    //   .status(StatusCodes.OK)
    //   .clearCookie('cc.sid')
    //   .json({ success: true });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const logout = { handler: logoutHandler };
