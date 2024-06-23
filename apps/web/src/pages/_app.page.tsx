import type { ExtendedAppProps } from "~/shared/types";
import * as React from "react";
import Router from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import NProgress from "nprogress";
import { queryClient } from "~/lib/queries";
import { AuthProvider, ClubCompassLogo } from "~/shared/components";
import { Layout } from "~/shared/components";
import { parseSubdomain } from "~/lib/utils";
import "../styles/global.css";

NProgress.configure({ easing: "ease", speed: 500 });

const ClubCompass = ({ Component, pageProps: { session, ...pageProps } }: ExtendedAppProps) => {
  const { layout } = Component;
  const [validSubdomain, setValidSubdomain] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return setValidSubdomain(null);
    const parseResult = parseSubdomain(window.location.href);
    setValidSubdomain(parseResult.valid);
  }, []);

  React.useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  if (validSubdomain === null)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <ClubCompassLogo className="animate-pulse text-5xl" />
      </div>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout layout={layout}>
          <Component {...pageProps} />
          <Toaster
            position="bottom-right"
            toastOptions={{ style: { border: "1px solid #E5E5E5", fontSize: "15px", color: "#4A4A4A" } }}
          />
        </Layout>
      </AuthProvider>
      <Analytics />
    </QueryClientProvider>
  );
};

export default ClubCompass;
