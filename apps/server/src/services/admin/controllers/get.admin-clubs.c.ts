import type { Controller, GetAdminClubs } from '@/cc';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError, int } from '~/lib/utils';

export const getAdminClubsValidation = z.object({
  query: z.object({
    limit: z.preprocess(Number, z.number()).optional(),
    offset: z.preprocess(Number, z.number()).optional(),
  }),
});

export const getAdminClubsHandler: Controller<GetAdminClubs> = async (req, res) => {
  const { success } = formatResponse<GetAdminClubs>(res);
  const { limit, offset } = req.query;

  try {
    const clubs = await prisma.club.findMany({
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
      },
      orderBy: { updatedAt: 'desc' },
    });

    const totalClubs = await prisma.club.count();

    const percentageOfOpenClubs =
      (await prisma.club.count({
        where: { availability: 'OPEN' },
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

export const getAdminClubs = {
  schema: getAdminClubsValidation,
  handler: getAdminClubsHandler,
};
