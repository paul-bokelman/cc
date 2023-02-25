import type { Controller } from 'types';
import type { GetClubs } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError, int } from '~/lib/utils';

// export type GetClubs = {
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

export const getClubsValidation = z.object({
  query: z.object({
    limit: z.preprocess(Number, z.number()).optional(),
    offset: z.preprocess(Number, z.number()).optional(),
  }),
});

export const getClubsHandler: Controller<GetClubs> = async (req, res) => {
  const { success } = formatResponse<GetClubs>(res);
  const { limit, offset } = req.query;

  try {
    const clubs = await prisma.club.findMany({
      take: int(limit),
      skip: int(offset),
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        availability: true,
        tags: { select: { name: true } },
      },
    });

    return success(
      StatusCodes.OK,
      clubs.map((club) => ({ ...club, tags: club.tags.map((tag) => tag.name) }))
    );
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getClubs = {
  schema: getClubsValidation,
  handler: getClubsHandler,
};
