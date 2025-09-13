import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  RiAdminLine,
  RiHome9Line,
} from "react-icons/ri";
import { MdOutlineAddModerator } from "react-icons/md";
import { PiHamburgerThin } from "react-icons/pi";
import { HiLogout } from "react-icons/hi";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();
  const location = useLocation();

  const handleLogout = () => {
    logout().then(() => {});
  };

  const getDashboardRoute = () => {
    if (isAdmin) return "/dashboard/adminHome";
    if (isModerator) return "/dashboard/moderator";
    if (isOwner) return "/dashboard/ownerHome";
    return "/dashboard/userHome";
  };

  const getDashboardRoleLabel = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isModerator) return "Moderator Panel";
    if (isOwner) return "Owner Dashboard";
    return "User Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-red-100">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Role-Based Dashboard Title */}
          <Link to={getDashboardRoute()} className="flex items-center gap-2">
            <RiHome9Line size={28} className="text-[#ff1818]" />
            <Typography className="text-[15px] lg:text-2xl font-extrabold text-[#ff1818] font-Kanit uppercase">
              {getDashboardRoleLabel()}
            </Typography>
          </Link>

          {/* Logout Button */}
          {user && (
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl rounded-full px-4 py-2"
            >
              <HiLogout size={18} />
              Logout
            </Button>
          )}
        </div>
      </header>

      {/* Content Area */}
      <main className="p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
