import { Controller, ValidationErrors, Register, registerSchema } from "cc-common";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { generateSession } from "~/lib/session";
import { generate, formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<Register> = async (req, res) => {
  const { success, validationError } = formatResponse<Register>(res);
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username: { equals: username } }, { email: { equals: email } }] },
      select: { username: true, email: true },
    });

    if (existingUser) {
      let errors: ValidationErrors = [];

      if (existingUser.username === username) {
        errors.push({ path: "username", message: "Username already exists" });
      }

      if (existingUser.email === email) {
        errors.push({ path: "email", message: "Email already exists" });
      }

      return validationError(errors);
    }

    const user = await prisma.user.create({
      data: {
        ccid: await generate.ccid(),
        username,
        email,
        password: hashedPassword,
        school: { connect: { name: req.school } },
      },
    });

    const cookie = await generateSession({ userId: user.id, school: req.school });
    const { password: _, ...userWithoutPassword } = user;
    return success(StatusCodes.OK, userWithoutPassword, cookie);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const register = { handler, schema: registerSchema };
