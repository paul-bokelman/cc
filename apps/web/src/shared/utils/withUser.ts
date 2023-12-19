import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { ServerError, Authorization } from "cc-common";
import axios from "axios";
import { authorize } from "~/lib/queries";

type AuthorizationOptions = Omit<Authorization["body"], "signedCookie"> & {
  fail?: string;
};

type WithUser = <Props extends { [key: string]: any }>(
  auth: AuthorizationOptions,
  ssp?: GetServerSideProps<Props>
) => (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<Props | unknown>>;

export const withUser: WithUser = (auth, ssp) => {
  return async (context) => {
    const { role = "MEMBER", fail = "/" } = auth; // add allow and block soon (user acc states)
    const signedCookie = context.req.cookies?.["cc.sid"] ?? ""; //? sent as cookie?? ofc not that would be too easy

    try {
      await authorize({ body: { role, signedCookie }, params: undefined, query: undefined });
      if (!ssp) return { props: {} };

      return await ssp(context);
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
