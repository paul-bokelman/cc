import type { Controller, NewClub } from "cc-common";
import { Availability } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, generate } from "~/lib/utils";

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
  body: z
    .object({
      name: z
        .string()
        .max(50, "Club name cannot be longer than 50 characters")
        .min(3, "Club name must be at least 3 characters")
        .refine(async (input) => {
          const club = await prisma.club.findFirst({ where: { name: input } });
          return !club;
        }, "Club name already exists"),
      description: z.string().min(10, "Club description must be at least 10 characters"),
      availability: z.nativeEnum(Availability),
      applicationLink: z.string().optional().nullable(),
      tags: z
        .string()
        .array() // should get all tags and check if they exist (names)
        .max(3, "You can only select up to 3 tags")
        .min(1, "You must select at least 1 tag")
        .refine(async (input) => {
          const tags = await prisma.tag.findMany({ where: { name: { in: input } } });
          return tags.length === input.length;
        }, "One or more tags do not exist"),

      meetingFrequency: z.string(),
      meetingTime: z.string(),
      meetingDays: z.string(),
      meetingLocation: z.string(),

      contactEmail: z.string().email(),
      instagram: z.string().optional().nullable(),
      facebook: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      website: z.string().optional().nullable(),

      president: z.string(),
      vicePresident: z.string(),
      secretary: z.string(),
      treasurer: z.string(),
      advisor: z.string(),
    })
    .superRefine((input, ctx) => {
      if (input.availability === "APPLICATION" && !input.applicationLink) {
        ctx.addIssue({
          path: ["applicationLink"],
          code: z.ZodIssueCode.custom,
          message: "Required if the club requires an application",
        });
      }
    }),
});

export const newClubHandler: Controller<NewClub> = async (req, res) => {
  const { success } = formatResponse<NewClub>(res);
  const club = req.body;

  const { tags, ...rest } = club;

  try {
    const { id } = await prisma.club.create({
      data: {
        slug: generate.slug(rest.name),
        tags: { connect: tags.map((name) => ({ name })) },
        ...rest,
      },
    });

    return success(StatusCodes.OK, { id });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const newClub = { schema: newClubValidation, handler: newClubHandler };
