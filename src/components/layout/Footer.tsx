import {
  CircleUserRound,
  Ghost,
  Info,
  LogIn,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import * as motion from "motion/react-client";
import { useNavigate } from "react-router";
import HatHouse from "../ui/HouseHat";
import useEasyAuth from "@/hooks/use-easy-auth";
import useLogin from "@/hooks/use-login";
import useLogout from "@/hooks/use-logout";

const Footer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useEasyAuth();
  const { login } = useLogin();
  const { logout } = useLogout();
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <div className="relative w-10 ">
        {/* Menu Button - Always Visible */}
        <div
          className="bg-black rounded-full w-20 shadow-2xl h-20 flex items-center justify-center  mb-5 ml-5"
          onClick={() => setOpen(!open)}
        >
          <Menu color="white" size={40} />
        </div>

        {/* Overlay & Animated Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -50, y: 50 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 20,
                y: 0,
                transition: { duration: 0.1 },
              }}
              exit={{ opacity: 0, scale: 0, x: -30, y: 80 }}
              key="box"
              className="absolute bottom-0 left-0 bg-black p-5 rounded-xl rounded-bl-none flex items-center text-white justify-center text-left flex-col shadow-lg z-50"
              onClick={() => setOpen(false)}
            >
              <div>
                <div
                  className="flex flex-row mx-4 my-4  text-left "
                  onClick={() => navigate("/")}
                >
                  <div className="mr-2 cursor-pointer">
                    <HatHouse />
                  </div>
                  <div className="cursor-pointer">Cribs</div>
                </div>
                <div
                  className="flex flex-row mx-4 my-4  text-left "
                  onClick={() => navigate("/profile")}
                >
                  <div className="mr-2 cursor-pointer">
                    <CircleUserRound />
                  </div>
                  <div className="cursor-pointer">Profile</div>
                </div>
                {user?.access_token && (
                  <div
                    className="flex flex-row mx-4 my-4  text-left "
                    onClick={() => navigate("/settings")}
                  >
                    <div className="mr-2 cursor-pointer">
                      <Settings />
                    </div>
                    <div className="cursor-pointer">Settings</div>
                  </div>
                )}
                <div
                  className="flex flex-row mx-4 my-4  text-left "
                  onClick={() => navigate("/support")}
                >
                  <div className="mr-2 cursor-pointer">
                    <Info />
                  </div>
                  <div className="cursor-pointer">Support</div>
                </div>
                {user?.access_token ? null : (
                  <div
                    className="flex flex-row mx-4 my-4  text-left "
                    onClick={login}
                  >
                    <div className="mr-2 cursor-pointer">
                      <LogIn />
                    </div>
                    <div className="cursor-pointer">Login</div>
                  </div>
                )}
                {user?.access_token ? (
                  <div
                    className="flex flex-row mx-4 my-4  text-left "
                    onClick={logout}
                  >
                    <div className="mr-2 cursor-pointer">
                      <LogOut />
                    </div>
                    <div className="cursor-pointer">Logout</div>
                  </div>
                ) : null}
                <div
                  className="flex flex-row mx-4 my-4  text-left text-orange-400"
                  onClick={() => navigate("/contest")}
                >
                  <div className="mr-2 cursor-pointer">
                    <Ghost />
                  </div>
                  <div className="cursor-pointer">Halloween Contest</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Footer;
