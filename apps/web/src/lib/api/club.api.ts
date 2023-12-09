import type { GetClubs, GetClub, NewClub, EditClub, DeleteClub } from "cc-common";
import { query, mutation } from "./api";

const getClubs = query<GetClubs>("/clubs");
const getClub = query<GetClub>("/clubs/[identifier]");
const newClub = mutation<NewClub>("/clubs/new");
const editClub = mutation<EditClub>("/clubs/[identifier]/edit");
const deleteClub = mutation<DeleteClub>("/clubs/[identifier]/delete");

export const clubs = {
  all: getClubs,
  get: getClub,
  new: newClub,
  edit: editClub,
  delete: deleteClub,
};
