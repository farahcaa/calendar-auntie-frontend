import useEasyAuth from "@/hooks/use-easy-auth";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

type Props = {
  children: React.ReactNode;
};

const AuthContextProvider = ({ children }: Props) => {
  const { authContext } = useEasyAuth();
  const navigate = useNavigate();
  const location = useLocation();
  //   const { toast } = useToast();

  useEffect(() => {
    if (authContext.user?.expired) {
      authContext.signoutSilent();
      return;
    }

    // if exipired, redirect to login
    return authContext.events.addAccessTokenExpired(() => {
      navigate("/login");
    });
  }, [authContext, navigate]);

  useEffect(() => {
    // start auto sign in renew
    return authContext.startSilentRenew();
  }, [authContext]);

  useEffect(() => {
    return authContext.events.addUserLoaded(() => {
      navigate(location.pathname, { replace: true });
    });
  }, [authContext, navigate, location]);

  return <>{children}</>;
};

export default AuthContextProvider;
