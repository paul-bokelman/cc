import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { ServerError, Authorization } from "cc-common";
import axios from "axios";
import { parseSubdomain } from "~/lib/utils";

type AuthorizationOptions = Omit<Authorization["query"], "sid"> & {
  fail?: string;
};

type WithUser = <Props extends { [key: string]: any }>(
  options: AuthorizationOptions,
  ssp?: GetServerSideProps<Props>
) => (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<Props | unknown>>;

export const withUser: WithUser = (options, ssp) => {
  return async (ctx) => {
    const { role = "STUDENT", fail = "/" } = options;
    const sid = ctx.req.cookies?.["cc.sid"] ?? "";

    const url = new URL(ctx.req.headers["x-forwarded-proto"] + "://" + ctx.req.headers.host); // uh... what?
    const parseResult = parseSubdomain(url);
    if (!parseResult.valid)
      return { redirect: { permanent: false, destination: `${fail}?unauthorized=Invalid school` } };

    try {
      await axios.get(`${url}/api/${parseResult.subdomain}/auth/authorized`, {
        params: { role, sid },
        withCredentials: true,
      });

      if (!ssp) return { props: {} };

      return await ssp(ctx);
    } catch (e) {
      if (axios.isAxiosError<ServerError>(e)) {
        if (e.response?.data.code === 401) {
          // separated because there may be conditional logic later...
          return { redirect: { permanent: false, destination: `${fail}?unauthorized=${e.response?.data.message}` } };
        }

        return { redirect: { permanent: false, destination: `${fail}?unauthorized=${e.response?.data.message}` } };
      }
    }

    return { redirect: { permanent: false, destination: `${fail}?unauthorized=An unknown error occurred.` } };
  };
};
