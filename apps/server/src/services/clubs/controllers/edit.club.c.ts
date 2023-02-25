import type { Controller } from 'types';
import type { EditClub } from '@/cc';
import { type ClubRole, Availability } from '@prisma/client';
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
  body: z.object({
    general: z
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
          }, 'Club name already exists'),
        description: z
          .string()
          .min(10, 'Club description must be at least 10 characters'),
        availability: z.nativeEnum(Availability),
        applicationLink: z.string().optional(),
        tags: z
          .array(z.string()) // should get all tags and check if they exist (names)
          .max(3, 'You can only select up to 3 tags')
          .min(1, 'You must select at least 1 tag')
          .refine(async (input) => {
            const tags = await prisma.tag.findMany({
              where: { name: { in: input } },
            });
            return tags.length === input.length;
          }, 'One or more tags do not exist'),
      })
      .superRefine((input, ctx) => {
        console.log(input.applicationLink);
        if (input.availability === 'APPLICATION' && !input.applicationLink) {
          ctx.addIssue({
            path: ['applicationLink'],
            code: z.ZodIssueCode.custom,
            message: 'Required if the club requires an application',
          });
        }
      }),

    meetingInformation: z
      .object({
        meetingFrequency: z.string().optional(),
        meetingTime: z.string().optional(),
        meetingDays: z.string().optional(), // should be array of days
        meetingLocation: z.string().optional(),
      })
      .optional(),

    contactInformation: z.object({
      contactEmail: z.string().email().optional(),
      media: z
        .object({
          instagram: z.string().optional(),
          facebook: z.string().optional(),
          twitter: z.string().optional(),
          website: z.string().optional(),
        })
        .superRefine((input, ctx) => {
          ['instagram', 'twitter', 'facebook', 'website'].map((platform) => {
            //! clean this shit up
            if (
              ['instagram', 'twitter', 'facebook', 'website'].includes(
                platform
              ) &&
              !input[platform as keyof typeof input]
            ) {
              ctx.addIssue({
                path: [`${platform}`],
                message: 'A value is required to include this platform',
                code: z.ZodIssueCode.custom,
              });
            }
          });
        })
        .optional(),
    }),

    members: z
      .object({
        president: z.string().optional(),
        vicePresident: z.string().optional(),
        secretary: z.string().optional(),
        treasurer: z.string().optional(),
        advisor: z.string().optional(),
      })
      .optional(),
  }),
});

export const editClubHandler: Controller<EditClub> = async (req, res) => {
  const { error, success } = formatResponse<EditClub>(res);
  const club = req.body;

  try {
    const existingClub = await prisma.club.findFirst({
      where: { [req.query.method]: req.params.identifier },
    });

    if (!existingClub) {
      return error(StatusCodes.NOT_FOUND, 'Club not found');
    }

    const { id } = await prisma.club.update({
      where: { [req.query.method]: req.params.identifier },
      data: {
        slug: club.general?.name ? generate.slug(club.general.name) : undefined,
        ...club.general,
        ...club.meetingInformation,
        ...club.contactInformation,
        tags: {
          set: club.general?.tags?.map((name) => ({ name })) ?? undefined,
        },
        ...Object.entries(club.members ?? {}).map(([role, name]) => ({
          [role as ClubRole]: name ?? undefined,
        })),
      },
    });

    return success(StatusCodes.OK, { id });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const editClub = {
  schema: editClubValidation,
  handler: editClubHandler,
};
