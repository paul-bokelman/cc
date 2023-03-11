import { type Club, type Tag, Availability } from '@prisma/client';

type ClubIdentifierMethods = 'slug' | 'id' | 'name';

/* -------------------------------- GET CLUBS ------------------------------- */

export type GetClubs = {
  args: {
    query: {
      limit?: number;
      offset?: number;
      filter?: { tags?: string[]; tagMethod?: 'inclusive' | 'exclusive'; availability?: Availability[] };
      sort?: 'new' | 'old' | 'name-desc' | 'name-asc';
    };
  };
  payload: Array<
    Pick<Club, 'id' | 'name' | 'slug' | 'description' | 'availability'> & {
      tags: (Tag & { active: boolean })[];
    }
  >;
};

/* -------------------------------- GET CLUB -------------------------------- */

export type GetClub = {
  args: {
    query: {
      method: ClubIdentifierMethods;
      includeSimilar?: string;
    };
    params: {
      identifier: string;
    };
  };
  payload: Club & { tags: Tag[]; similarClubs?: (Club & { tags: Tag[] })[] };
};

/* -------------------------------- NEW CLUB -------------------------------- */

export type NewClub = {
  args: {
    body: Omit<Club, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & { tags: Array<Tag['name']> };
  };
  payload: { id: string };
};

/* -------------------------------- EDIT CLUB ------------------------------- */

export type EditClub = {
  args: {
    query: { method: ClubIdentifierMethods };
    params: { identifier: string };
    body: Partial<Omit<Club, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & { tags: Array<Tag['name']> }>;
  };
  payload: { id: string };
};

/* ------------------------------- DELETE CLUB ------------------------------ */

export type DeleteClub = {
  args: {
    query: { method: ClubIdentifierMethods };
    params: { identifier: string };
  };
  payload: { id: string };
};
