import type { GetTags, GetTag, NewTag } from "cc-common";
import type { QueryHook, MutationHook, Error } from "./query.utils";
import { useMutation, useQuery } from "react-query";
import { query, mutation } from "./query.utils";

/* -------------------------------- GET TAGS -------------------------------- */
const getTags = query<GetTags>("/tags");
export const useGetTags: QueryHook<GetTags> = (args, options) => {
  return useQuery<GetTags["payload"], Error>(["tags"], async () => await getTags(args), options);
};

/* --------------------------------- GET TAG -------------------------------- */
const getTag = query<GetTag>("/tags/[id]");
export const useGetTag: QueryHook<GetTag> = (args, options) => {
  return useQuery<GetTag["payload"], Error>(["tag", args.params], async () => await getTag(args), options);
};

/* --------------------------------- NEW TAG -------------------------------- */
const newTag = mutation<NewTag>("/tags/new");
export const useNewTag: MutationHook<NewTag> = (options) => {
  return useMutation<NewTag["payload"], Error, Omit<NewTag, "payload">>(newTag, options);
};
