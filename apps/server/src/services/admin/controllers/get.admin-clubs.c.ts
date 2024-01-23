import { Controller, GetAdminClubs, getAdminClubsSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, int } from "~/lib/utils";

const handler: Controller<GetAdminClubs> = async (req, res) => {
  const { success } = formatResponse<GetAdminClubs>(res);
  const { limit, offset } = req.query;

  try {
    const clubs = await prisma.club.findMany({
      where: { school: { name: req.school } },
      take: int(limit),
      skip: int(offset),
      select: {
        id: true,
        slug: true,
        name: true,
        president: true,
        advisor: true,
        availability: true,
        tags: true,
        status: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const totalClubs = await prisma.club.count({ where: { school: { name: req.school } } });

    const percentageOfOpenClubs =
      (await prisma.club.count({
        where: {
          AND: {
            school: { name: req.school },
            availability: "OPEN",
          },
        },
      })) / totalClubs;

    return success(StatusCodes.OK, {
      clubs,
      overview: {
        totalClubs,
        totalMembersInClubs: totalClubs * 4,
        percentageOfOpenClubs: Math.floor(percentageOfOpenClubs * 100),
      },
    });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getAdminClubs = { handler, schema: getAdminClubsSchema };
