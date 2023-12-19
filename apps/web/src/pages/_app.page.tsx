import type { ExtendedAppProps } from "~/shared/types";
import { QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "~/lib/queries";
import { AuthProvider } from "~/shared/components";
import { Layout } from "~/shared/components";
import "../styles/global.css";

const ClubCompass = ({ Component, pageProps: { session, ...pageProps } }: ExtendedAppProps) => {
  const { layout } = Component;

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
