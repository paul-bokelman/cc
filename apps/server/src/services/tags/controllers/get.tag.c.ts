import { Controller, GetTag, getTagSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<GetTag> = async (req, res) => {
  const { error, success } = formatResponse<GetTag>(res);
  const { id } = req.params;

  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) return error(StatusCodes.NOT_FOUND, "Tag not found");

    return success(StatusCodes.OK, tag);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTag = { handler, schema: getTagSchema };
