import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { authOptions } from "pages/api/auth/[...nextauth].controller";

type AuthorizationOptions = {
  fail?: string;
};

type WithUser = <Props extends { [key: string]: unknown }>(
  auth: AuthorizationOptions,
  ssp?: GetServerSideProps<Props>
) => (
  context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<Props | unknown>>;

const unauthorizedMessage = "You're not authorized to view that page.";

export const withUser: WithUser = (auth, ssp) => {
  return async (context) => {
    const { fail = "/" } = auth;

    try {
      const providers = await getProviders();

      const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      );

      if (!session?.user) {
        return {
          redirect: {
            permanent: false,
            destination: `${fail}?unauthorized=${unauthorizedMessage}`,
          },
        };
      }

      if (!ssp) {
        return {
          props: {
            providers,
            session: session,
          },
        };
      }

      return await ssp(context);
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: `${fail}?unauthorized="Something went wrong"`,
        },
      };
    }
  };
};
