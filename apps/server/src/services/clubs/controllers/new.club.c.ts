import type { Controller } from 'types';
import type { NewClub } from '@/cc';
import { Availability } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError, generate } from '~/lib/utils';

// type NewClub = {
//   // args: z.infer<typeof newClubValidation>;
//   args: {
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

export const newClubValidation = z.object({
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

    meetingInformation: z.object({
      meetingFrequency: z.string(),
      meetingTime: z.string(),
      meetingDays: z.string(),
      meetingLocation: z.string(),
    }),

    contactInformation: z.object({
      contactEmail: z.string().email(),
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
        }),
    }),

    members: z.object({
      president: z.string(),
      vicePresident: z.string(),
      secretary: z.string(),
      treasurer: z.string(),
      advisor: z.string(),
    }),
  }),
});

export const newClubHandler: Controller<NewClub> = async (req, res) => {
  const { success } = formatResponse<NewClub>(res);
  const club = req.body;

  try {
    const { id } = await prisma.club.create({
      data: {
        slug: generate.slug(club.general.name),
        ...club.general,
        ...club.meetingInformation,
        ...club.contactInformation,
        tags: {
          connect: club.general.tags.map((name) => ({ name })),
        },
        president: club.members.president,
        vicePresident: club.members.vicePresident,
        secretary: club.members.secretary,
        treasurer: club.members.treasurer,
        advisor: club.members.advisor,
      },
    });

    return success(StatusCodes.OK, { id });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const newClub = { schema: newClubValidation, handler: newClubHandler };
