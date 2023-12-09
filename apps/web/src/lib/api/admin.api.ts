import type { GetAdminClubs } from "cc-common";
import { query } from "./api";

const getClubs = query<GetAdminClubs>("/admin/clubs");

export const admin = {
  clubs: getClubs,
};
