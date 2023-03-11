import type { Controller, GetClub } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError, bool } from '~/lib/utils';

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
    includeSimilar: z
      .string()
      .optional()
      .refine((input) => {
        if (input === undefined) return true;
        if (typeof bool(input) === 'boolean') return true;
      }),
  }),
  params: z.object({ identifier: z.string() }),
});

export const getClubHandler: Controller<GetClub> = async (req, res) => {
  const { error, success } = formatResponse<GetClub>(res);
  const { method, includeSimilar } = req.query;
  const { identifier } = req.params;

  try {
    const club = await prisma.club.findUnique({ where: { [method]: identifier }, include: { tags: true } });
    if (!club) return error(StatusCodes.NOT_FOUND, 'Club not found');

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

export const getClub = { schema: getClubValidation, handler: getClubHandler };
