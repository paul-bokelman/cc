import type { Controller } from '~/types';
import type { Login } from '@/cc';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { generateSession } from '~/lib/session';
import { formatResponse, handleControllerError } from '~/lib/utils';

// type Login = {
//   args: {
//     body: {
//       username: string;
//       password: string;
//     };
//   };
//   payload: {
//     user: AuthenticatedUser;
//     signedCookie: string;
//   };
// };

// check if username and email are taken in validation
const loginValidation = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

const loginHandler: Controller<Login> = async (req, res) => {
  const { error, success } = formatResponse<Login>(res);

  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user)
      return error(StatusCodes.UNAUTHORIZED, 'Invalid username or password');

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return error(StatusCodes.UNAUTHORIZED, 'Invalid username or password');

    const signedCookie = await generateSession(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return success(StatusCodes.OK, { user: userWithoutPassword, signedCookie });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const login = { schema: loginValidation, handler: loginHandler };
