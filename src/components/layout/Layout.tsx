import { Outlet, useNavigate } from "react-router";
import Header from "@/components/layout/Header";

const Layout = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-center h-full flex-col">
      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>
      <div className="w-full h-fullm min-h-screen flex-grow p-4">
        <Outlet />
      </div>
      <div className="w-full ">
        <footer className=" flex w-full p-4 text-gray-500 text-sm justify-between">
          &copy; 2024 Calendar-Auntie. All rights reserved.
          <div className="font-bold" onClick={() => navigate("/admin/login")}>
            relogin
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
