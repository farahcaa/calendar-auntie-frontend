import useEasyAuth from "./use-easy-auth";

type UseLogin = {
  login: () => void;
};

const useLogin = (): UseLogin => {
  const { authContext } = useEasyAuth();

  const login = () => {
    authContext.signinRedirect({
      scope: "campuscribs-backend-as-audience openid email profile",
    });
  };

  return {
    login,
  };
};

export default useLogin;
