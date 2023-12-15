import { Controller, GetTags } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<GetTags> = async (_, res) => {
  const { error, success } = formatResponse<GetTags>(res);

  try {
    const tags = await prisma.tag.findMany();

    if (!tags) return error(StatusCodes.NOT_FOUND, "Tags not found");

    return success(StatusCodes.OK, tags);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTags = { handler };
