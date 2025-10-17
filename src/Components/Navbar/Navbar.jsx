import { Button, Input } from "@material-tailwind/react";
import { FaHamburger, FaUserCircle } from "react-icons/fa";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
  IconButton,

} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { RiShoppingBag2Line } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Darkmode from "../Darkmode/Darkmode";
import { IoMdHome, IoMdLogIn, IoMdLogOut, IoMdSettings } from "react-icons/io";
import useAdmin from "../Hooks/useAdmin";
import useModerator from "../Hooks/useModerator";
import useRestaurantOwner from "../Hooks/useRestaurantOwner";
import useAddFood from "../Hooks/useAddFood";
import { GiHamburger } from "react-icons/gi";
import { useTypewriter } from "react-simple-typewriter";
import Search from "./Search/Search";
const Navbar = () => {
  const DashboardLink = ({ to, icon, label }) => (
    <Link to={to}>
      <MenuItem className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2">
        <span className="text-gray-600">{icon}</span>
        <Typography className="font-medium">{label}</Typography>
      </MenuItem>
    </Link>
  );

  const { logout, user } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();
  const [cartFood] = useAddFood()
  const handleLogut = () => {
    logout()
      .then(() => { })
  }
  const navbarLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        HOME
      </NavLink>
      <NavLink
        to="/restaurants"
        className={({ isActive }) =>
          isActive
            ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        RESTAURANTS
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive
            ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        ABOUT
      </NavLink>
      {
        isAdmin && (
          <NavLink
            to="/dashboard/adminHome"
            className={({ isActive }) =>
              isActive
                ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
            }
          >
            ADMIN DASHBOARD
          </NavLink>
        )
      }
      {

        isModerator && (
          <NavLink
            to="/dashboard/moderator"
            className={({ isActive }) =>
              isActive
                ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
            }
          >
            MODERATOR DASHBOARD
          </NavLink>
        )
      }
      {isOwner
        && (
          <NavLink
            to="/dashboard/ownerHome"
            className={({ isActive }) =>
              isActive
                ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
            }
          >
            OWNER DASHBOARD
          </NavLink>
        )
      }

      {!isAdmin && !isModerator && !isOwner && (
        <NavLink
          to="/dashboard/userHome"
          className={({ isActive }) =>
            isActive
              ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
              : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
          }
        >
          YOUR DASHBOARD
        </NavLink>
      )}
    </>
  );


  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      }
      else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])
  const [text] = useTypewriter({
    words: [
      "Search your Favorite Restaurant...",
      "Pizza, Burger, Pasta...",
      "Find...",
    ],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <div>
      {/* First Navbar */}
      <div className="navbar px-4 md:px-6 lg:px-8">
        <div className="navbar-start">
          <a className=" w-10 text-xl   lg:w-14 drop-shadow-md  rounded-full "><img src="https://i.ibb.co.com/F57mtch/logo2.png" alt="" /></a>
        </div>
        <div className="navbar-center " >
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        </div>
        <div className="navbar-end gap-2">
          {user ? (
            <Menu placement="bottom-end">
              <MenuHandler>
                <Avatar
                  variant="circular"
                  alt="User profile"
                  className="cursor-pointer border-2 border-[#ff1818] w-10 h-10 hover:scale-105 transition-transform"
                  src={user?.photoURL || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
                />
              </MenuHandler>

              <MenuList className="min-w-[220px] p-2 shadow-lg rounded-xl">


                {/* Menu Items */}
                <Link to="/myProfile">
                  <MenuItem className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2">
                    <IoMdSettings className="text-gray-600" size={18} />
                    <Typography className="font-medium">Edit Profile</Typography>
                  </MenuItem>
                </Link>

                {/* Dashboard Links */}
                <div className="lg:hidden ">
                  {isAdmin && (
                    <DashboardLink
                      to="/dashboard/adminHome"
                      icon={<IoMdHome size={18} />}
                      label="Admin Dashboard"
                    />
                  )}

                  {isModerator && (
                    <DashboardLink
                      to="/dashboard/moderator"
                      icon={<IoMdHome size={18} />}
                      label="Moderator Dashboard"
                    />
                  )}

                  {isOwner && (
                    <DashboardLink
                      to="/dashboard/ownerHome"
                      icon={<IoMdHome size={18} />}
                      label="Owner Dashboard"
                    />
                  )}

                  {!isAdmin && !isModerator && !isOwner && (
                    <DashboardLink
                      to="/dashboard/userHome"
                      icon={<IoMdHome size={18} />}
                      label="User Dashboard"
                    />
                  )}
                </div>

                {/* Logout */}
                <MenuItem
                  onClick={handleLogut}
                  className="flex items-center gap-3 hover:bg-red-50 rounded-lg p-2 mt-1"
                >
                  <IoMdLogOut className="text-[#ff1818]" size={18} />
                  <Typography className="font-medium text-[#ff1818]">Sign Out</Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/login" className="flex items-center">
              <button className="flex items-center justify-center p-2 rounded-full border-2 border-[#ff1818]  hover:bg-[#ff1818] text-[#ff1818] hover:text-white transition-colors">
                <IoMdLogIn size={20} />
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* Second Navbar */}
      <div className={`navbar  px-3 md:px-6 lg:px-8 bg-[#ff1818] ${scrolled ? "fixed top-0 left-0 w-full  shadow z-10 " : ""}`}>
        <div className="navbar-start">

          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white  font-extrabold">

              <Menu>
                <MenuHandler>
                  <a className="text-white text-2xl"> <GiHamburger /></a>
                </MenuHandler>



                <MenuList>
                  <MenuItem>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "font-extrabold text-[#ff1818] border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#ff1818] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                          : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#ff1818] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                      }
                    >
                      HOME
                    </NavLink>
                  </MenuItem>
                  {/* <MenuItem>
                    <NavLink
                      to="/food"
                      className={({ isActive }) =>
                        isActive ? " font-extrabold    border-b-2  border-y-red-200 " : "font-extrabold   "
                      }
                    >
                      FOOD
                    </NavLink>

                  </MenuItem> */}
                  <MenuItem> <NavLink
                    to="/restaurants"
                    className={({ isActive }) =>
                      isActive
                        ? "font-extrabold text-[#ff1818] border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#ff1818] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                        : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#ff1818] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                    }
                  >
                    RESTAURANTS
                  </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        isActive
                          ? "font-extrabold text-[#ff1818] border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#ff1818] before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                          : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-[#ff1818] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                      }
                    >
                      ABOUT
                    </NavLink>
                  </MenuItem>

                  <MenuItem>
                    {
                      isAdmin && (
                        <NavLink
                          to="/dashboard/adminHome"
                          className={({ isActive }) =>
                            isActive
                              ? "font-extrabold text-[#ff1818] border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                              : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                          }
                        >
                          ADMIN DASHBOARD
                        </NavLink>
                      )
                    }
                    {

                      isModerator && (
                        <NavLink
                          to="/dashboard/moderator"
                          className={({ isActive }) =>
                            isActive
                              ? "font-extrabold text-[#ff1818] border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                              : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                          }
                        >
                          MODERATOR DASHBOARD
                        </NavLink>
                      )
                    }
                    {isOwner
                      && (
                        <NavLink
                          to="/dashboard/ownerHome"
                          className={({ isActive }) =>
                            isActive
                              ? "font-extrabold text-[#ff1818] border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                              : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                          }
                        >
                          OWNER DASHBOARD
                        </NavLink>
                      )
                    }

                    {!isAdmin && !isModerator && !isOwner && (
                      <NavLink
                        to="/dashboard/userHome"
                        className={({ isActive }) =>
                          isActive
                            ? "font-extrabold text-white border-b-2 border-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                            : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
                        }
                      >
                        YOUR DASHBOARD
                      </NavLink>
                    )}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">
            {navbarLinks}
          </ul>
        </div>
        <div>
          <div>

          </div>
        </div>
        <div className="navbar-end">
          <div>
            {
              user ? <>
                <Link to={"/myProfile"}>

                  <div tabIndex={0} role="button" className="md:block hidden">
                    <div className="">
                      <div className="badge text-[12px] bg-white  text-[#ff1818] ">  <p className="flex justify-center items-center gap-3 font-bold "><FaUserCircle /> {user?.displayName}</p></div>

                    </div>
                  </div>

                </Link>
              </> : <></>
            }
          </div>
          <div className="w-16 ">
            {
              user ? <>
                <Link to={"/dashboard/myOrder"}>

                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <div className="text-2xl text-white">  <GiHamburger /></div>
                      <span className="badge bg-white text-[10px] indicator-item text-[#ff1818]">{cartFood.length}</span>
                    </div>
                  </div>

                </Link>
              </> : <></>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;