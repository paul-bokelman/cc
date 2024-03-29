import { Controller, GetClubs, getClubsSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, int } from "~/lib/utils";

const handler: Controller<GetClubs> = async (req, res) => {
  const { success } = formatResponse<GetClubs>(res);
  const { limit, offset, filter, sort = "new" } = req.query;

  const method = filter?.tagMethod === "exclusive" ? "every" : "some";
  // exclusive is flawed, because it will return clubs that include all tags, but not necessarily all tags

  try {
    let filteredClubs: GetClubs["payload"]["clubs"] = [];

    const clubs = await prisma.club.findMany({
      where: {
        school: { name: req.school },
        AND: filter
          ? {
              tags: filter.tags ? { [method]: { name: { in: filter.tags } } } : undefined,
              status: filter.status ? { in: filter.status } : undefined,
            }
          : undefined,
      },
      take: int(limit),
      skip: int(offset),
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        availability: true,
        tags: true,
        status: true,
      },
      orderBy: {
        name: sort === "name-asc" ? "asc" : sort === "name-desc" ? "desc" : undefined,
        createdAt: sort === "new" ? "desc" : sort === "old" ? "asc" : undefined, // defaults to new
      },
    });

    filteredClubs = clubs
      .map((club) => ({
        ...club,
        tags: club.tags.map((tag) => ({ ...tag, active: filter?.tags ? filter.tags.includes(tag.name) : false })),
      }))
      .sort((a, b) => (!a.description && b.description ? 1 : a.description && !b.description ? -1 : 0));

    // temporary fix for exclusive tag filtering
    if (filter?.tagMethod === "exclusive") {
      filteredClubs = filteredClubs.filter((club) => club.tags.length !== 0);
    }

    const totalClubs = await prisma.club.count({ where: { school: { name: req.school } } });

    return success(StatusCodes.OK, { totalClubs, clubs: filteredClubs });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getClubs = { handler, schema: getClubsSchema };
