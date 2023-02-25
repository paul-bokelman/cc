import type { ExtendedAppProps } from '~/shared/types';
import { QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '~/lib/api';
import { Layout } from '~/shared/components';
import '../styles/global.css';

const Tab = ({
  Component,
  pageProps: { session, ...pageProps },
}: ExtendedAppProps) => {
  const { layout } = Component;

  return (
    <QueryClientProvider client={queryClient}>
      <Layout layout={layout}>
        <Component {...pageProps} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { backgroundColor: '#171717', color: 'white' },
          }}
        />
      </Layout>
    </QueryClientProvider>
  );
};

export default Tab;
