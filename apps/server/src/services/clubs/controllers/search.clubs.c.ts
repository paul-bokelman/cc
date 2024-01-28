import { Controller, SearchClubs, searchClubsSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<SearchClubs> = async (req, res) => {
  const { success } = formatResponse<SearchClubs>(res);
  const { searchQuery } = req.query;

  try {
    const clubs = await prisma.club.findMany({
      where: {
        AND: {
          name: { contains: searchQuery, mode: "insensitive" },
          school: { name: req.school },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
        availability: true,
        tags: { select: { name: true } },
      },
    });

    return success(StatusCodes.OK, clubs);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const searchClubs = { handler, schema: searchClubsSchema };
