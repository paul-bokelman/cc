import type { QueryClientConfig } from 'react-query';
import { QueryClient } from 'react-query';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: false,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);
