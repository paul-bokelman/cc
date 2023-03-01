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
          position="bottom-right"
          toastOptions={{
            style: {
              border: '1px solid #E5E5E5',
              fontSize: '15px',
              color: '#4A4A4A',
            },
          }}
        />
      </Layout>
    </QueryClientProvider>
  );
};

export default Tab;
