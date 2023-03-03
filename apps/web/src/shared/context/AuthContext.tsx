import type { FC } from 'react';
import type { Children } from '~/shared/types';
import type { AuthenticatedUser, GetUser, Logout, ServerError } from '@/cc';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { type UseMutateAsyncFunction, useMutation, useQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { api } from '~/lib/api';

interface AuthContext {
  user: AuthenticatedUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: UseMutateAsyncFunction<Logout['payload'], ServerError>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be within AuthProvider');
  }
  return context;
};

export const AuthProvider: FC<{ children: Children }> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<GetUser['payload'], ServerError>(['user'], async () => api.user.get()); // include sid in qk?
  const { mutateAsync: logout } = useMutation<Logout['payload'], ServerError, Logout['args']>(api.auth.logout, {
    onError: () => {
      // loading toast on mutate?
      toast.error('Failed to logout');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries<GetUser['payload']>(['user']);
      queryClient.setQueryData<GetUser['payload']>(['user'], null); // have to manually set user to null for some odd reason
      await router.push('/clubs'); // should conditionally push to diff locations
      toast.success('Logged out');
    },
  });

  const isLoggedIn = !isLoading && !!user;

  useEffect(() => {
    const unauthorized = router.query?.unauthorized as string | undefined;
    const callbackURL = router.query?.callbackURL as string | undefined;
    if (unauthorized) {
      const url = callbackURL ? `${router.pathname}?callbackURL=${callbackURL}` : router.pathname;
      toast.error(`Unauthorized: ${decodeURI(unauthorized)}`);
      router.replace(url, undefined, { shallow: true });
    }
  }, [router, router.query.unauthorized]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      loading: isLoading,
      isLoggedIn,
      logout,
    }),
    [user, isLoading, isLoggedIn, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
