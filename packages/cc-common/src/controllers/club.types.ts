import { type Club, type Tag, Availability } from "@prisma/client";
import type { ToControllerConfig } from "../utils.types";
import * as z from "zod";
import { nonempty } from "../zod.utils";

export const clubIdentifierMethods = ["slug", "id", "name"] as const;

/* -------------------------------- GET CLUBS ------------------------------- */
export type GetClubs = ToControllerConfig<
  typeof getClubsSchema,
  Array<
    Pick<Club, "id" | "name" | "slug" | "description" | "availability"> & {
      tags: (Tag & { active: boolean })[];
    }
  >
>;
export const getClubsSchema = z.object({
  query: z.object({
    limit: z.preprocess(Number, z.number()).optional(),
    offset: z.preprocess(Number, z.number()).optional(),
    filter: z
      .object({
        tags: z.array(z.string()).optional(),
        tagMethod: z.enum(["inclusive", "exclusive"]).optional(),
        availability: z.array(z.nativeEnum(Availability)).optional(),
      })
      .optional(),
    sort: z.enum(["new", "old", "name-desc", "name-asc"]).optional(),
  }),
});

/* -------------------------------- GET CLUB -------------------------------- */
export type GetClub = ToControllerConfig<
  typeof getClubSchema,
  Club & { tags: Tag[]; similarClubs?: (Club & { tags: Tag[] })[] }
>;
export const getClubSchema = z.object({
  query: z.object({
    method: z.enum(clubIdentifierMethods),
    includeSimilar: z
      .string()
      .optional()
      .refine((input) => {
        if (input === undefined) return true;
        if (typeof input === "string" && (input === "true" || input === "false")) return true;
      }),
  }),
  params: z.object({ identifier: z.string() }),
});

/* -------------------------------- NEW CLUB -------------------------------- */

export type NewClub = ToControllerConfig<typeof newClubSchema, { id: string }>;
export const newClubSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .max(50, "Club name cannot be longer than 50 characters")
        .min(3, "Club name must be at least 3 characters"),
      description: z.string().min(10, "Club description must be at least 10 characters"),
      availability: z.nativeEnum(Availability),
      applicationLink: z.string().optional().nullable(),
      tags: z
        .string()
        .array() // should get all tags and check if they exist (names)
        .min(1, "You must select at least 1 tag")
        .max(3, "You can only select up to 3 tags"),

      meetingFrequency: z.string().optional(),
      meetingTime: z.string().optional(),
      meetingDays: z.string().optional(),
      meetingLocation: z.string().optional(),

      contactEmail: z.string().email(),
      // check nonempty?
      instagram: z.string().optional().nullable(),
      facebook: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      website: z.string().optional().nullable(),

      advisor: z.string().min(3, "Name must be at least 3 characters").pipe(nonempty),
      president: z.string().min(3, "Name must be at least 3 characters").pipe(nonempty),
      vicePresident: z
        .union([z.string().length(0), z.string().min(3, "Name must be at least 3 characters")])
        .optional()
        .transform((e) => (e === "" ? null : e)),
      secretary: z
        .union([z.string().length(0), z.string().min(3, "Name must be at least 3 characters")])
        .optional()
        .transform((e) => (e === "" ? null : e)),
      treasurer: z
        .union([z.string().length(0), z.string().min(3, "Name must be at least 3 characters")])
        .optional()
        .transform((e) => (e === "" ? null : e)),
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

/* -------------------------------- EDIT CLUB ------------------------------- */

export type EditClub = ToControllerConfig<typeof editClubSchema, { id: string }>;
export const editClubSchema = z.object({
  query: z.object({ method: z.enum(["slug", "id", "name"]) }),
  params: z.object({ identifier: z.string() }),
  body: z
    .object({
      name: z
        .string()
        .max(50, "Club name cannot be longer than 50 characters")
        .min(3, "Club name must be at least 3 characters")
        .optional(),
      description: z
        .union([z.string().length(0), z.string().min(3, "Club description must be at least 10 characters")])
        .optional()
        .transform((e) => (e === "" ? null : e)),
      availability: z.nativeEnum(Availability).optional(),
      applicationLink: z.string().optional().nullable(),
      tags: z
        .array(z.string())
        .max(3, "You can only select up to 3 tags")
        // .min(1, "You must select at least 1 tag")
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

      advisor: z.string().min(3, "Name must be at least 3 characters").pipe(nonempty).optional(),
      president: z.string().min(3, "Name must be at least 3 characters").pipe(nonempty).optional(),
      vicePresident: z
        .union([z.string().length(0), z.string().min(3, "Name must be at least 3 characters")])
        .optional()
        .transform((e) => (e === "" ? null : e)),
      secretary: z
        .union([z.string().length(0), z.string().min(3, "Name must be at least 3 characters")])
        .optional()
        .transform((e) => (e === "" ? null : e)),
      treasurer: z
        .union([z.string().length(0), z.string().min(3, "Name must be at least 3 characters")])
        .optional()
        .transform((e) => (e === "" ? null : e)),
    })
    .superRefine((input, ctx) => {
      if (!input) return;
      if (input.availability === "APPLICATION" && !input.applicationLink) {
        ctx.addIssue({
          path: ["applicationLink"],
          code: z.ZodIssueCode.custom,
          message: "Required if the club requires an application",
        });
      }
    }),
});

/* ------------------------------- DELETE CLUB ------------------------------ */
export type DeleteClub = ToControllerConfig<typeof deleteClubSchema, { id: string }>;
export const deleteClubSchema = z.object({
  query: z.object({ method: z.enum(clubIdentifierMethods) }),
  params: z.object({ identifier: z.string() }),
});
