import type { Controller, EditClub } from '@/cc';
import { Availability } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError, generate } from '~/lib/utils';

// export type EditClub = {
//   args: {
//     query: {
//       method: 'slug' | 'id' | 'name';
//     };
//     params: {
//       identifier: string;
//     };
//     body: {
//       general: Pick<
//         Club,
//         'name' | 'description' | 'availability' | 'applicationLink'
//       > & { tags: Array<Tag['name']> };
//       meetingInformation: Pick<
//         Club,
//         'meetingFrequency' | 'meetingTime' | 'meetingDays' | 'meetingLocation'
//       >;
//       contactInformation: Pick<Club, 'contactEmail'> & {
//         media: {
//           instagram?: string;
//           facebook?: string;
//           twitter?: string;
//           website?: string;
//         };
//       };
//       members: {
//         president: string;
//         vicePresident: string;
//         secretary: string;
//         treasurer: string;
//         advisor: string;
//       };
//     };
//   };
//   payload: { id: string };
// };

export const editClubValidation = z.object({
  query: z.object({ method: z.enum(['slug', 'id', 'name']) }),
  params: z.object({ identifier: z.string() }),
  body: z
    .object({
      name: z
        .string()
        .max(50, 'Club name cannot be longer than 50 characters')
        .min(3, 'Club name must be at least 3 characters')
        .refine(async (input) => {
          const club = await prisma.club.findFirst({
            where: {
              name: input,
            },
          });
          return !club;
        }, 'Club name already exists')
        .optional(),
      description: z.string().min(10, 'Club description must be at least 10 characters').optional(),
      availability: z.nativeEnum(Availability).optional(),
      applicationLink: z.string().optional().nullable(),
      tags: z
        .array(z.string()) // should get all tags and check if they exist (names)
        .max(3, 'You can only select up to 3 tags')
        .min(1, 'You must select at least 1 tag')
        .refine(async (input) => {
          const tags = await prisma.tag.findMany({
            where: { name: { in: input } },
          });
          return tags.length === input.length;
        }, 'One or more tags do not exist')
        .optional(),

      meetingFrequency: z.string().optional(),
      meetingTime: z.string().optional(),
      meetingDays: z.string().optional(), // should be array of days
      meetingLocation: z.string().optional(),

      contactEmail: z.string().email().optional(),
      instagram: z.string().optional().nullable(),
      facebook: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      website: z.string().optional().nullable(),

      president: z.string().optional(),
      vicePresident: z.string().optional(),
      secretary: z.string().optional(),
      treasurer: z.string().optional(),
      advisor: z.string().optional(),
    })
    .superRefine((input, ctx) => {
      if (!input) return;
      if (input.availability === 'APPLICATION' && !input.applicationLink) {
        ctx.addIssue({
          path: ['applicationLink'],
          code: z.ZodIssueCode.custom,
          message: 'Required if the club requires an application',
        });
      }
    }),
});

export const editClubHandler: Controller<EditClub> = async (req, res) => {
  const { error, success } = formatResponse<EditClub>(res);
  const club = req.body;

  try {
    const existingClub = await prisma.club.findFirst({
      where: { [req.query.method]: req.params.identifier },
    });

    if (!existingClub) return error(StatusCodes.NOT_FOUND, 'Club not found');

    const { tags, ...rest } = club ?? {};

    const { id } = await prisma.club.update({
      where: { [req.query.method]: req.params.identifier },
      data: {
        slug: club?.name ? generate.slug(club.name) : undefined,
        ...rest,
        tags: { set: tags?.map((name) => ({ name })) ?? undefined },
      },
    });

    return success(StatusCodes.OK, { id });
  } catch (e) {
    console.log(e);
    return handleControllerError(e, res);
  }
};

export const editClub = {
  schema: editClubValidation,
  handler: editClubHandler,
};
