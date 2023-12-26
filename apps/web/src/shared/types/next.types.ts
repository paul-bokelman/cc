import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { Layouts } from "~/shared/components/Layout";

export type NextPageWithConfig<P = unknown, IP = P> = NextPage<P, IP> & {
  layout?: Layouts;
  // seo?: SEOProps;
};

export type ExtendedAppProps<P = unknown> = AppProps<P> & {
  Component: NextPageWithConfig;
  pageProps: P & { session: unknown | null }; // include session
};
