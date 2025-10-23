import useEasyAuth from "@/hooks/use-easy-auth";
import LoadingPage from "@/pages/loading/LoadingPage";
import { Navigate, Outlet } from "react-router";

const ReverseProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useEasyAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ReverseProtectedRoute;
