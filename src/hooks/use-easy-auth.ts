import { useEffect, useState } from "react";
import { useAuth, AuthContextProps } from "react-oidc-context";
import { User } from "oidc-client-ts";

type UseEasyAuth = {
  /**
   * The user's authentication status.
   * If loading, this will be `false`.
   * If authenticated, this will be `true`.
   * If unauthenticated, this will be `false`.
   */
  isAuthenticated: boolean;

  /**
   * The authentication loading status.
   */
  isLoading: boolean;

  /**
   * The user's authentication details.
   * If unauthenticated, this will be `null`.
   */
  user: User | null;

  /**
   * The authentication context.
   */
  authContext: AuthContextProps;
};
const useEasyAuth = (): UseEasyAuth => {
  const auth = useAuth();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth?.user?.access_token && !auth.isLoading) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(auth.isLoading);
  }, [auth]);

  return {
    isAuthenticated,
    isLoading,
    user: auth?.user || null,
    authContext: auth,
  };
};

export default useEasyAuth;
