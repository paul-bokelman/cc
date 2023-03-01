import type { Controller, DeleteClub } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError } from '~/lib/utils';

export const deleteClubValidation = z.object({
  query: z.object({ method: z.enum(['slug', 'id', 'name']) }),
  params: z.object({ identifier: z.string() }),
});

export const deleteClubHandler: Controller<DeleteClub> = async (req, res) => {
  const { error, success } = formatResponse<DeleteClub>(res);
  const { method } = req.query;
  const { identifier } = req.params;

  try {
    const club = await prisma.club.findUnique({
      where: { [method]: identifier },
      select: { id: true },
    });

    if (!club) return error(StatusCodes.NOT_FOUND, 'Club not found');

    await prisma.club.delete({
      where: { id: club.id },
    });

    return success(StatusCodes.OK, club);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const deleteClub = { schema: deleteClubValidation, handler: deleteClubHandler };
