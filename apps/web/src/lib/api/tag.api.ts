import type { GetTags } from "cc-common";
import { query } from "./api";

const getTags = query<GetTags>("/tags");

export const tags = {
  all: getTags,
};
