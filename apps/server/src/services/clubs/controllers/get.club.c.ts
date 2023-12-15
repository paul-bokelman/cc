import { Controller, GetClub, getClubSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, bool } from "~/lib/utils";

const handler: Controller<GetClub> = async (req, res) => {
  const { error, success } = formatResponse<GetClub>(res);
  const { method, includeSimilar } = req.query;
  const { identifier } = req.params;

  try {
    const club = await prisma.club.findUnique({
      where: { [method]: identifier } as { slug: string } | { id: string } | { name: string }, // should be inferred...
      include: { tags: true },
    });
    if (!club) return error(StatusCodes.NOT_FOUND, "Club not found");

    const similarClubs = bool(includeSimilar)
      ? (
          await prisma.club.findMany({
            where: { tags: { some: { id: { in: club.tags.map((tag) => tag.id) } } } },
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
