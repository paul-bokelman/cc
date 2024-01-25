import type { ExtendedAppProps } from "~/shared/types";
import * as React from "react";
import { QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "~/lib/queries";
import { subdomains } from "~/lib/utils";
import { AuthProvider, ClubCompassLogo } from "~/shared/components";
import { Layout } from "~/shared/components";
import { parseSubdomain, appendSubdomain } from "~/lib/utils";
import "../styles/global.css";

const ClubCompass = ({ Component, pageProps: { session, ...pageProps } }: ExtendedAppProps) => {
  const { layout } = Component;
  const [validSubdomain, setValidSubdomain] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return setValidSubdomain(null);
    const parseResult = parseSubdomain(window.location.href);
    setValidSubdomain(parseResult.valid);
  }, []);

  if (validSubdomain === null)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <ClubCompassLogo className="animate-pulse text-5xl" />
      </div>
    );

  if (validSubdomain === false) {
    return (
      <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
        <div className="text-4xl font-bold text-gray-800">Under construction (v1.0)</div>
        <div className="">Main site currently not supported. Supported locations: </div>
        <div className="flex items-center gap-2">
          {subdomains.map((sd) => (
            <div key={sd}>
              <span
                onClick={() => {
                  window.location.href = appendSubdomain(sd, process.env.NEXT_PUBLIC_CLIENT_URL as string);
                }}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {sd}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
    </QueryClientProvider>
  );
};

export default ClubCompass;
