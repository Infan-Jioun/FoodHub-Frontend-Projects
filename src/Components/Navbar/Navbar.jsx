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
  const ClockIcon = () => {
    return (
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.99998 14.9C9.69736 14.9 11.3252 14.2257 12.5255 13.0255C13.7257 11.8252 14.4 10.1974 14.4 8.49998C14.4 6.80259 13.7257 5.17472 12.5255 3.97449C11.3252 2.77426 9.69736 2.09998 7.99998 2.09998C6.30259 2.09998 4.67472 2.77426 3.47449 3.97449C2.27426 5.17472 1.59998 6.80259 1.59998 8.49998C1.59998 10.1974 2.27426 11.8252 3.47449 13.0255C4.67472 14.2257 6.30259 14.9 7.99998 14.9ZM8.79998 5.29998C8.79998 5.0878 8.71569 4.88432 8.56566 4.73429C8.41563 4.58426 8.21215 4.49998 7.99998 4.49998C7.7878 4.49998 7.58432 4.58426 7.43429 4.73429C7.28426 4.88432 7.19998 5.0878 7.19998 5.29998V8.49998C7.20002 8.71213 7.28434 8.91558 7.43438 9.06558L9.69678 11.3288C9.7711 11.4031 9.85934 11.4621 9.95646 11.5023C10.0536 11.5425 10.1577 11.5632 10.2628 11.5632C10.3679 11.5632 10.472 11.5425 10.5691 11.5023C10.6662 11.4621 10.7544 11.4031 10.8288 11.3288C10.9031 11.2544 10.9621 11.1662 11.0023 11.0691C11.0425 10.972 11.0632 10.8679 11.0632 10.7628C11.0632 10.6577 11.0425 10.5536 11.0023 10.4565C10.9621 10.3593 10.9031 10.2711 10.8288 10.1968L8.79998 8.16878V5.29998Z"
          fill="#90A4AE"
        />
      </svg>
    );
  }
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