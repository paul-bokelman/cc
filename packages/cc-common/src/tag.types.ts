import type { Tag } from '@prisma/client';

/* -------------------------------- GET TAGS -------------------------------- */

export type GetTags = {
  args: undefined;
  payload: Array<Tag>;
};

/* --------------------------------- GET TAG -------------------------------- */

export type GetTag = {
  args: {
    params: {
      id: string;
    };
  };
  payload: Tag;
};

/* --------------------------------- NEW TAG -------------------------------- */

export type NewTag = {
  args: {
    body: {
      name: string;
    };
  };
  payload: Tag;
};
