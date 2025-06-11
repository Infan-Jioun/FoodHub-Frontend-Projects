import React from "react";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  MenuHandler,
  Avatar,
  Menu,
} from "@material-tailwind/react";
import { PiHamburgerThin } from "react-icons/pi";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LuUserSearch } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { RiAdminLine, RiShoppingBag4Line, RiHome9Line } from "react-icons/ri";
import { MdOutlineAddModerator } from "react-icons/md";
import { PiContactlessPaymentLight } from "react-icons/pi";
import Darkmode from "../../Darkmode/Darkmode";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";
import { IoIosAddCircleOutline, IoMdLogIn } from "react-icons/io";
import { HiLogout } from "react-icons/hi";
const Dashboard = () => {
  const { user , logout } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();

  console.log("isAdmin:", isAdmin);
  console.log("isModerator:", isModerator);
  console.log("isOwner:", isOwner);
const handleLogout = () => {
  logout()
  .then(() => {})
}
const location = useLocation();
const noNavbarFooter = ["/dashboard/paymentSuccess"].includes(location.pathname);
  return (
    <div className="min-h-screen">
      {/* Navbar */}
     {noNavbarFooter || <div className="navbar bg-white shadow-2xl">
    
        <div className="flex-1">
          <span className="text-xl font-bold text-[#ff1818]">DASHBOARD</span>
        </div>
        <Menu>
    <MenuHandler>
                  <Avatar
                    variant="circular"
                    alt="tania andrew"

                    className="cursor-pointer w-9 h-9 rounded-full"
                    src={user?.photoURL || "https://i.ibb.co.com/PGwHS087/profile-Imagw.jpg"}
                  />
                </MenuHandler>
    </Menu>
      </div> }

      {/* Drawer */}
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Main Content */}
    
          <Outlet />
        </div>
      
      </div>
    </div>
  );
};

export default Dashboard;
