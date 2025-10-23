import useEasyAuth from "./use-easy-auth";

type UseLogout = {
  logout: () => void;
};

const useLogout = (): UseLogout => {
  const { authContext } = useEasyAuth();

  const logout = () => {
    authContext.signoutRedirect();
  };

  return {
    logout,
  };
};

export default useLogout;
