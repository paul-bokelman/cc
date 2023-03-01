import type { Controller, GetClubs } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError, int } from '~/lib/utils';

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
    filter: z
      .object({
        tags: z.string().array().optional(),
        tagMethod: z.enum(['inclusive', 'exclusive']).optional(), // depends on tags (default to exclusive?)
      })
      .optional(),
    sort: z.enum(['new', 'old', 'name-desc', 'name-asc']).optional(),
  }),
});

export const getClubsHandler: Controller<GetClubs> = async (req, res) => {
  const { success } = formatResponse<GetClubs>(res);
  const { limit, offset, filter, sort = 'new' } = req.query;

  const method = filter?.tagMethod === 'exclusive' ? 'every' : 'some';

  try {
    const clubs = await prisma.club.findMany({
      where: {
        tags: filter?.tags ? { [method]: { name: { in: filter?.tags ?? undefined } } } : undefined,
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
        name: sort === 'name-asc' ? 'asc' : sort === 'name-desc' ? 'desc' : undefined,
        createdAt: sort === 'new' ? 'desc' : sort === 'old' ? 'asc' : undefined, // defaults to new
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

export const getClubs = {
  schema: getClubsValidation,
  handler: getClubsHandler,
};
