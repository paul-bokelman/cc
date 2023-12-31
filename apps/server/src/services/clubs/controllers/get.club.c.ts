import { Controller, GetClub, getClubSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, bool } from "~/lib/utils";

const handler: Controller<GetClub> = async (req, res) => {
  const { error, success } = formatResponse<GetClub>(res);
  const { method, includeSimilar } = req.query;
  const { identifier } = req.params;

  // todo: should query by school and identifier but this is ok for now
  try {
    const club = await prisma.club.findFirst({
      // @ts-ignore
      where: { AND: { [method]: identifier, school: { name: req.school } } }, // should be inferred...
      include: { tags: true },
    });
    if (!club) return error(StatusCodes.NOT_FOUND, "Club not found");

    const similarClubs = bool(includeSimilar)
      ? (
          await prisma.club.findMany({
            where: {
              AND: { school: { name: req.school }, tags: { some: { id: { in: club.tags.map((tag) => tag.id) } } } },
            },
            include: { tags: true },
          })
        )
          .filter((c) => c.id !== club.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
      : undefined;

    return success(StatusCodes.OK, { ...club, similarClubs });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getClub = { handler, schema: getClubSchema };
