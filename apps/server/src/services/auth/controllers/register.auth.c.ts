import type { Controller } from '~/types';
import type { Register } from '@/cc';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { generateSession } from '~/lib/session';
import { generate, handleControllerError } from '~/lib/utils';

// type Register = {
//   args: {
//     body: {
//       username: string;
//       email: string;
//       password: string;
//     };
//   };
//   payload: {
//     signedCookie: string;
//   };
// };

// check if username and email are taken in validation
export const registerValidation = z.object({
  body: z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  }),
});

export const registerHandler: Controller<Register> = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        ccid: await generate.ccid(),
        username,
        email,
        password: hashedPassword,
      },
    });

    const signedCookie = await generateSession(user.id);

    return res.status(StatusCodes.OK).json({ signedCookie });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const register = {
  schema: registerValidation,
  handler: registerHandler,
};
