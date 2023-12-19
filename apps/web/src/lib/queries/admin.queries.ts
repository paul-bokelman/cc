import type { GetAdminClubs } from "cc-common";
import type { QueryHook, Error } from "./query.utils";
import { useQuery } from "react-query";
import { query } from "./query.utils";

/* ----------------------------- GET ADMIN CLUBS ---------------------------- */
const getAdminClubs = query<GetAdminClubs>("/admin/clubs"); // could be directly in hook but this is more readable
export const useGetAdminClubs: QueryHook<GetAdminClubs> = (args, options) => {
  return useQuery<GetAdminClubs["payload"], Error>(
    ["admin-clubs", args.query],
    async () => await getAdminClubs(args),
    options
  );
};
