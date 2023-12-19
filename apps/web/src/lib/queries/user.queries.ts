import type { GetUser } from "cc-common";
import type { QueryHook, Error } from "./query.utils";
import { useQuery } from "react-query";
import { query } from "./query.utils";

/* -------------------------------- GET USER -------------------------------- */
const getUser = query<GetUser>("/user");
export const useGetUser: QueryHook<GetUser> = (args, options) => {
  return useQuery<GetUser["payload"], Error>(["clubs", args.query], async () => await getUser(args), options);
};
