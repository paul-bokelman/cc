import { type Club, type Tag, ClubStatus, ClubType } from "@prisma/client";
import type { ToControllerConfig } from "../utils.types";
import * as z from "zod";
import { nonempty } from "../zod.utils";

export const clubIdentifierMethods = ["slug", "id", "name"] as const;

/* -------------------------------- GET CLUBS ------------------------------- */
export type GetClubs = ToControllerConfig<
  typeof getClubsSchema,
  {
    totalClubs: number;
    clubs: Array<
      Pick<Club, "id" | "name" | "slug" | "description" | "availability" | "status"> & {
        tags: (Tag & { active: boolean })[];
      }
    >;
  }
>;
export const getClubsSchema = z.object({
  query: z.object({
    limit: z.preprocess(Number, z.number()).optional(),
    offset: z.preprocess(Number, z.number()).optional(),
    filter: z
      .object({
        tags: z.array(z.string()).optional(),
        tagMethod: z.enum(["inclusive", "exclusive"]).optional(),
        status: z.array(z.nativeEnum(ClubStatus)).optional(),
        // availability: z.array(z.nativeEnum(Availability)).optional(),
        // type: z.array(z.nativeEnum(ClubType)).optional(),
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

/* ------------------------------- SEARCH CLUBS ------------------------------ */
export type SearchClubs = ToControllerConfig<
  typeof searchClubsSchema,
  Array<
    Pick<Club, "id" | "name" | "slug" | "description" | "status" | "availability"> & { tags: Array<Pick<Tag, "name">> }
  >
>;
export const searchClubsSchema = z.object({
  query: z.object({ searchQuery: z.string() }),
});

/* -------------------------------- NEW CLUB -------------------------------- */

export type NewClub = ToControllerConfig<typeof newClubSchema, { id: string }>;
export const newClubSchema = z.object({
  body: z.object({
    name: z
      .string()
      .max(50, "Club name cannot be longer than 50 characters")
      .min(3, "Club name must be at least 3 characters"),
    description: z.string().min(10, "Club description must be at least 10 characters"),
    // availability: z.nativeEnum(Availability),
    type: z.nativeEnum(ClubType),
    status: z.nativeEnum(ClubStatus),
    applicationLink: z
      .string()
      .url()
      .optional()
      .or(z.string().length(0))
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    tags: z
      .string()
      .array() // should get all tags and check if they exist (names)
      .min(1, "You must select at least 1 tag")
      .max(3, "You can only select up to 3 tags"),

    meetingFrequency: z.string().max(10, "Meeting frequency cannot exceed 10 characters").optional(),
    meetingTime: z.string().max(18, "Meeting time cannot exceed 18 characters").optional(),
    meetingDays: z.string().max(48, "Meeting days cannot exceed 48 characters").optional(),
    meetingLocation: z.string().max(15, "Meeting location cannot exceed 15 characters").optional(),

    contactEmail: z.string().email(),
    // check nonempty?
    instagram: z.string().max(30, "Instagram handle cannot exceed 30 characters").optional().nullable(),
    facebook: z.string().max(50, "Facebook handle cannot exceed 50 characters").optional().nullable(),
    twitter: z.string().max(15, "Twitter handle cannot exceed 15 characters").optional().nullable(),
    website: z
      .string()
      .url()
      .optional()
      .or(z.string().length(0))
      .nullable()
      .transform((e) => (e === "" ? null : e)),

    advisor: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(35, "Name cannot exceed 35 characters") // may be an issue...
      .pipe(nonempty),
    president: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(35, "Name cannot exceed 35 characters")
      .pipe(nonempty),
    vicePresident: z
      .union([
        z.string().min(3, "Name must be at least 3 characters").max(35, "Name cannot exceed 35 characters"),
        z.string().length(0),
      ])
      .optional()
      .transform((e) => (e === "" ? null : e)),
    secretary: z
      .union([
        z.string().min(3, "Name must be at least 3 characters").max(35, "Name cannot exceed 35 characters"),
        z.string().length(0),
      ])
      .optional()
      .transform((e) => (e === "" ? null : e)),
    treasurer: z
      .union([
        z.string().min(3, "Name must be at least 3 characters").max(35, "Name cannot exceed 35 characters"),
        z.string().length(0),
      ])
      .optional()
      .transform((e) => (e === "" ? null : e)),
  }),
});

/* -------------------------------- EDIT CLUB ------------------------------- */

export type EditClub = ToControllerConfig<typeof editClubSchema, { id: string }>;
export const editClubSchema = z.object({
  query: z.object({ method: z.enum(["slug", "id", "name"]) }),
  params: z.object({ identifier: z.string() }),
  body: z.object({
    name: z
      .string()
      .max(50, "Club name cannot be longer than 50 characters")
      .min(3, "Club name must be at least 3 characters")
      .optional(),
    description: z
      .union([z.string().length(0), z.string().min(3, "Club description must be at least 10 characters")])
      .optional()
      .transform((e) => (e === "" ? null : e)),
    // availability: z.nativeEnum(Availability).optional(),
    status: z.nativeEnum(ClubStatus).optional(),
    applicationLink: z
      .string()
      .url()
      .optional()
      .or(z.string().length(0))
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    tags: z
      .array(z.string())
      .max(3, "You can only select up to 3 tags")
      // .min(1, "You must select at least 1 tag")
      .optional(),

    meetingFrequency: z.string().max(10, "Meeting frequency cannot exceed 10 characters").optional(),
    meetingTime: z.string().max(18, "Meeting time cannot exceed 18 characters").optional(),
    meetingDays: z.string().max(48, "Meeting days cannot exceed 48 characters").optional(),
    meetingLocation: z.string().max(15, "Meeting location cannot exceed 15 characters").optional(),

    contactEmail: z.string().email().optional(),
    instagram: z.string().max(30, "Instagram handle cannot exceed 30 characters").optional().nullable(),
    facebook: z.string().max(50, "Facebook handle cannot exceed 50 characters").optional().nullable(),
    twitter: z.string().max(15, "Twitter handle cannot exceed 15 characters").optional().nullable(),
    website: z
      .string()
      .url()
      .optional()
      .or(z.string().length(0))
      .nullable()
      .transform((e) => (e === "" ? null : e)),

    advisor: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(35, "Name cannot exceed 35 characters")
      .pipe(nonempty)
      .optional(),
    president: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(35, "Name cannot exceed 35 characters")
      .pipe(nonempty)
      .optional(),
    vicePresident: z
      .union([
        z.string().min(3, "Name must be at least 3 characters").max(35, "Name cannot exceed 35 characters"),
        z.string().length(0),
      ])
      .optional()
      .transform((e) => (e === "" ? null : e)),
    secretary: z
      .union([
        z.string().min(3, "Name must be at least 3 characters").max(35, "Name cannot exceed 35 characters"),
        z.string().length(0),
      ])
      .optional()
      .transform((e) => (e === "" ? null : e)),
    treasurer: z
      .union([
        z.string().min(3, "Name must be at least 3 characters").max(35, "Name cannot exceed 35 characters"),
        z.string().length(0),
      ])
      .optional()
      .transform((e) => (e === "" ? null : e)),
  }),
});

/* ------------------------------- DELETE CLUB ------------------------------ */
export type DeleteClub = ToControllerConfig<typeof deleteClubSchema, { id: string }>;
export const deleteClubSchema = z.object({
  query: z.object({ method: z.enum(clubIdentifierMethods) }),
  params: z.object({ identifier: z.string() }),
});
