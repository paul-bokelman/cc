import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { ServerError, Authorization } from '@/cc';
import { AxiosError } from 'axios';
import axios from 'axios';
import { api } from 'lib/api';

type AuthorizationOptions = Omit<Authorization['args']['body'], 'signedCookie'> & {
  fail?: string;
};

type WithUser = <Props extends { [key: string]: any }>(
  auth: AuthorizationOptions,
  ssp?: GetServerSideProps<Props>
) => (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<Props | unknown>>;

export const withUser: WithUser = (auth, ssp) => {
  return async (context) => {
    const { role = 'MEMBER', fail = '/' } = auth; // add allow and block soon (user acc states)
    const signedCookie = context.req.cookies?.['cc.sid'] ?? ''; //? sent as cookie?? ofc not that would be too easy

    try {
      await api.auth.authorize({ body: { role, signedCookie } });
      if (!ssp) return { props: {} };

      return await ssp(context);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const err = (e as AxiosError<ServerError>).response.data;
        if (err.code === 401) {
          // separated because there may be conditional logic later...
          return {
            redirect: {
              permanent: false,
              destination: `${fail}?unauthorized=${err.message}`,
            },
          };
        }

        return {
          redirect: {
            permanent: false,
            destination: `${fail}?unauthorized=${err.message}`,
          },
        };
      }
    }
  };
};
