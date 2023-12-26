import type { FC } from "react";
import type { Children } from "~/shared/types";
import type { AuthenticatedUser } from "cc-common";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useQueryClient } from "react-query";
import { useGetUser, useLogout } from "~/lib/queries";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { handleResponseError } from "../utils";

interface AuthContext {
  user: AuthenticatedUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: ReturnType<typeof useLogout>["mutateAsync"];
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be within AuthProvider");
  }
  return context;
};

export const AuthProvider: FC<{ children: Children }> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetUser(
    { params: undefined, query: undefined, body: undefined },
    { initialData: null }
  );

  const { mutateAsync: logout } = useLogout({
    onError: (e) => handleResponseError(e, "Unable to logout"),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ["user"] });
      toast.success("Logged out");
      await router.push("/clubs");
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
