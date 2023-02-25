import type { Controller } from 'types';
// import type { Club, Tag } from '@prisma/client';
import type { GetClub } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError } from '~/lib/utils';

// type GetClub = {
//   args: {
//     query: {
//       method: 'slug' | 'id' | 'name';
//     };
//     params: {
//       identifier: string;
//     };
//   };
//   payload: Club & { tags: Tag[] };
// };

export const getClubValidation = z.object({
  query: z.object({
    method: z.enum(['slug', 'id', 'name']),
  }),
  params: z.object({
    identifier: z.string(),
  }),
});

export const getClubHandler: Controller<GetClub> = async (req, res) => {
  const { error, success } = formatResponse<GetClub>(res);
  const { method } = req.query;
  const { identifier } = req.params;

  try {
    const club = await prisma.club.findUnique({
      where: { [method]: identifier },
      include: {
        tags: true,
      },
    });

    if (!club) {
      return error(StatusCodes.NOT_FOUND, 'Club not found');
    }

    return success(StatusCodes.OK, club);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getClub = { schema: getClubValidation, handler: getClubHandler };
