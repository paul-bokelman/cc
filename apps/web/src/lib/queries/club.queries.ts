import type { GetClubs, GetClub, SearchClubs, NewClub, EditClub, DeleteClub } from "cc-common";
import type { QueryHook, MutationHook, Error } from "./query.utils";
import { useMutation, useQuery } from "react-query";
import { query, mutation } from "./query.utils";

/* -------------------------------- GET CLUBS ------------------------------- */
const getClubs = query<GetClubs>("/clubs"); // could be directly in hook but this is more readable
export const useGetClubs: QueryHook<GetClubs> = (args, options) => {
  return useQuery<GetClubs["payload"], Error>(["clubs", args.query], async () => await getClubs(args), options);
};

/* -------------------------------- GET CLUB -------------------------------- */
const getClub = query<GetClub>("/clubs/[identifier]");
export const useGetClub: QueryHook<GetClub> = (args, options) => {
  return useQuery<GetClub["payload"], Error>(
    ["club", { [args.query.method]: args.params.identifier }],
    async () => await getClub(args),
    options
  );
};

/* ------------------------------ SEARCH CLUBS ------------------------------ */
const searchClubs = query<SearchClubs>("/clubs/search");
export const useSearchClubs: QueryHook<SearchClubs> = (args, options) => {
  return useQuery<SearchClubs["payload"], Error>(
    ["search-clubs", { searchQuery: args.query.searchQuery }],
    async () => await searchClubs(args),
    options
  );
};

/* -------------------------------- NEW CLUB -------------------------------- */
const newClub = mutation<NewClub>("/clubs/new");
export const useNewClub: MutationHook<NewClub> = (options) => {
  return useMutation<NewClub["payload"], Error, Omit<NewClub, "payload">>(newClub, options);
};

/* ------------------------------- EDIT CLUB -------------------------------- */
const editClub = mutation<EditClub>("/clubs/[identifier]/edit");
export const useEditClub: MutationHook<EditClub> = (options) => {
  return useMutation<EditClub["payload"], Error, Omit<EditClub, "payload">>(editClub, options);
};

/* ------------------------------ DELETE CLUB ------------------------------- */
const deleteClub = mutation<DeleteClub>("/clubs/[identifier]/delete");
export const useDeleteClub: MutationHook<DeleteClub> = (options) => {
  return useMutation<DeleteClub["payload"], Error, Omit<DeleteClub, "payload">>(deleteClub, options);
};
