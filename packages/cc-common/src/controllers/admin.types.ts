import type { Club, Tag } from "@prisma/client";
import type { ToControllerConfig } from "../utils.types";
import * as z from "zod";

/* ----------------------------- GET ADMIN CLUBS ---------------------------- */
export type GetAdminClubs = ToControllerConfig<
  typeof getAdminClubsSchema,
  {
    clubs: Array<
      Pick<Club, "id" | "name" | "advisor" | "president" | "availability" | "slug" | "status"> & { tags: Array<Tag> }
    >;
    overview: {
      totalClubs: number;
      totalMembersInClubs: number;
      percentageOfOpenClubs: number;
    };
  }
>;
export const getAdminClubsSchema = z.object({
  query: z.object({
    limit: z.preprocess(Number, z.number()).optional(),
    offset: z.preprocess(Number, z.number()).optional(),
  }),
});
