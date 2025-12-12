import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthContextProvider from "../auth/AuthContextProvider";

const Layout = () => {
  return (
    <AuthContextProvider>
      <div className="w-full flex justify-center h-full">
        <div
          className="flex flex-col
        min-h-screen w-full max-w-[600px] shadow-xl"
        >
          <div className="sticky top-0 z-50 bg-white">
            <Header />
          </div>
          <div className="w-full h-full">
            <Outlet />
          </div>

          <div className="sticky left-0 bottom-0 w-10">
            <Footer />
          </div>
        </div>
      </div>
    </AuthContextProvider>
  );
};

export default Layout;
