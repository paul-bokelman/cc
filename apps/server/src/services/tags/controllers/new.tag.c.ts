import { Controller, NewTag, newTagSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<NewTag> = async (req, res) => {
  const { error, success } = formatResponse<NewTag>(res);
  const { name } = req.body;
  try {
    const existingTag = await prisma.tag.findUnique({ where: { name } });

    if (existingTag) return error(StatusCodes.CONFLICT, "Tag already exists");

    const tag = await prisma.tag.create({ data: { name } });

    return success(StatusCodes.CREATED, tag);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const newTag = { handler, schema: newTagSchema };
