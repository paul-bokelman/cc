import { Controller, Login, loginSchema } from "cc-common";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { generateSession } from "~/lib/session";
import { formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<Login> = async (req, res) => {
  const { success, error } = formatResponse<Login>(res);
  const { username, password } = req.body;

  try {
    // index by subdomain
    const user = await prisma.user.findFirst({
      where: { AND: { username: { equals: username }, school: { name: { equals: req.school } } } },
    });
    if (!user) return error(StatusCodes.UNAUTHORIZED, "Invalid username or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(StatusCodes.UNAUTHORIZED, "Invalid username or password");

    // todo: school should come from user
    const cookie = await generateSession({ userId: user.id, school: req.subdomains[0] });
    const { password: _, ...userWithoutPassword } = user;
    return success(StatusCodes.OK, userWithoutPassword, cookie);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const login = { handler, schema: loginSchema };
