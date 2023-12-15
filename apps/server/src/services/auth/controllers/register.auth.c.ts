import { Controller, Register, registerSchema } from "cc-common";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { generateSession } from "~/lib/session";
import { generate, handleControllerError } from "~/lib/utils";

const handler: Controller<Register> = async (req, res) => {
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

export const register = { handler, schema: registerSchema };
