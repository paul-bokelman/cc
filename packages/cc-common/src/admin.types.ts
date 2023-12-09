import type { Club, Tag } from "@prisma/client";

/* ----------------------------- GET ADMIN CLUBS ---------------------------- */

export type GetAdminClubs = {
  args: {
    query: {
      limit?: number;
      offset?: number;
    };
  };
  payload: {
    clubs: Array<Pick<Club, "id" | "name" | "advisor" | "president" | "availability" | "slug"> & { tags: Array<Tag> }>;
    overview: {
      totalClubs: number;
      totalMembersInClubs: number;
      percentageOfOpenClubs: number;
    };
  };
};
