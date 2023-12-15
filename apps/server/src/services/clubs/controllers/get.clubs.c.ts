import { Controller, GetClubs, getClubsSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, int } from "~/lib/utils";

//   args: {
//     query: {
//       limit?: number;
//       offset?: number;
//     };
//   };
//   payload: Array<
//     Pick<Club, 'id' | 'name' | 'slug' | 'description' | 'availability'>
//   >;
// };

const handler: Controller<GetClubs> = async (req, res) => {
  const { success } = formatResponse<GetClubs>(res);
  const { limit, offset, filter, sort = "new" } = req.query;

  const method = filter?.tagMethod === "exclusive" ? "every" : "some";
  // exclusive is flawed, because it will return clubs that include all tags, but not necessarily all tags

  try {
    const clubs = await prisma.club.findMany({
      where: {
        AND: filter
          ? {
              tags: filter.tags ? { [method]: { name: { in: filter.tags } } } : undefined,
              availability: filter.availability ? { in: filter.availability } : undefined,
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
      },
      orderBy: {
        name: sort === "name-asc" ? "asc" : sort === "name-desc" ? "desc" : undefined,
        createdAt: sort === "new" ? "desc" : sort === "old" ? "asc" : undefined, // defaults to new
      },
    });

    return success(
      StatusCodes.OK,
      clubs.map((club) => ({
        ...club,
        tags: club.tags.map((tag) => ({ ...tag, active: filter?.tags ? filter.tags.includes(tag.name) : false })),
      }))
    );
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getClubs = { handler, schema: getClubsSchema };
