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
const noNavbarFooter = ["/dashboard/paymentHistory"].includes(location.pathname);
  return (
    <div className="min-h-screen">
      {/* Navbar */}
     {noNavbarFooter || <div className="navbar bg-red-50  shadow-2xl px-4 lg:px-38">
    
        <div className="flex-1  text-red-500 font-extrabold text-3xl mt-3">
        {
                    user && isAdmin && <Link to={"/dashboard/adminHome"}>
                      

                        <Typography  className="text-red-500 font-extrabold text-xl drop-shadow-2xl font-Kanit uppercase  ">
                          Dashboard
                        </Typography>
                     
                    </Link>
                  }
                  {
                    user && isModerator && <Link to={"/dashboard/moderator"}>
                  
                        <Typography  className="text-red-500 font-extrabold text-xl drop-shadow-2xl font-Kanit uppercase  ">
                          Dashboard
                        </Typography>
                      
                    </Link>
                  }
                  {
                    user && isOwner && <Link to={"/dashboard/ownerHome"}>
                    

                        <Typography  className="text-red-500 font-extrabold text-xl drop-shadow-2xl font-Kanit uppercase  ">
                          Dashboard
                        </Typography>
                      
                    </Link>
                  }
                  {
                    user && !isAdmin && !isModerator && !isOwner && <Link to={"/dashboard/userHome"}>
                     

                        <Typography  className="text-red-500 font-extrabold text-xl drop-shadow-2xl font-Kanit uppercase  ">
                          Dashboard
                        </Typography>
                 
                    </Link>
                  }
        </div>
        
    <Button onClick={handleLogout} className="btn bg-red-600 mt-3 drop-shadow-xl  hover:bg-red-50 hover:text-white  ">Logout </Button>
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
