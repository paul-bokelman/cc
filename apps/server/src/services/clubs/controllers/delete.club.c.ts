import { Controller, DeleteClub, deleteClubSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<DeleteClub> = async (req, res) => {
  const { error, success } = formatResponse<DeleteClub>(res);
  const { method } = req.query;
  const { identifier } = req.params;

  try {
    const club = await prisma.club.findUnique({
      where: { [method]: identifier } as { slug: string } | { id: string } | { name: string }, // todo: same issue as get club
      select: { id: true },
    });

    if (!club) return error(StatusCodes.NOT_FOUND, "Club not found");
    await prisma.club.delete({ where: { id: club.id } });

    return success(StatusCodes.OK, club);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const deleteClub = { handler, schema: deleteClubSchema };
