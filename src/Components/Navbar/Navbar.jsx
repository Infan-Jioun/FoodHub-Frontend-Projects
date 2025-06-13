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
import { IoMdLogIn } from "react-icons/io";
import useAdmin from "../Hooks/useAdmin";
import useModerator from "../Hooks/useModerator";
import useRestaurantOwner from "../Hooks/useRestaurantOwner";
import useAddFood from "../Hooks/useAddFood";
import { GiHamburger } from "react-icons/gi";

const Navbar = () => {
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
            ? "font-extrabold text-white border-b-2 border-red-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        HOME
      </NavLink>
      <NavLink
        to="/restaurants"
        className={({ isActive }) =>
          isActive
            ? "font-extrabold text-white border-b-2 border-red-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        RESTAURANTS
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive
            ? "font-extrabold text-white border-b-2 border-red-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
            : "font-extrabold text-white relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-white before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
        }
      >
        ABOUT
      </NavLink>
    </>
  );


  const [scrolled, setScrolled] = useState(false);
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

  return (
    <div>
      {/* First Navbar */}
      <div className="navbar px-4 md:px-6 lg:px-8">
        <div className="navbar-start">
          <a className=" w-10  lg:w-14  rounded-full "><img src="https://i.ibb.co.com/F57mtch/logo2.png" alt="" /></a>
        </div>
        <div className="navbar-center " >
         <Link to={"/search"}>
         <div className="relative flex  md:w-max ">
            <Input
              type="search" a
              placeholder="Search"
              color="red"
              onBlurCapture={"red"}
              containerProps={{
                className: " w-[17px] md:w-[50px] lg:w-[600px] rounded-ful"
              }}
              className=" !border-red-500 pl-9 font-extrabold  rounded-full text-red-500 md:rounded-full placeholder:text-red-500 focus:!border-red-500"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="!absolute left-3 top-[13px] text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
         </Link>

        </div>
        <div className="navbar-end gap-1">

        
          {
            user ? <>
              <Menu>
                <MenuHandler>
                  <Avatar
                    variant="circular"
                    alt="tania andrew"

                    className="cursor-pointer border-2 border-red-500 w-9 h-9 rounded-full"
                    src={user?.photoURL || "https://i.ibb.co.com/PGwHS087/profile-Imagw.jpg"}
                  />
                </MenuHandler>
                <MenuList>
                <Link to={"/myProfile"}>
                <MenuItem className="flex items-center gap-2">
                <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.48999 1.17C9.10999 -0.39 6.88999 -0.39 6.50999 1.17C6.45326 1.40442 6.34198 1.62213 6.18522 1.80541C6.02845 1.9887 5.83063 2.13238 5.60784 2.22477C5.38505 2.31716 5.1436 2.35564 4.90313 2.33709C4.66266 2.31854 4.42997 2.24347 4.22399 2.118C2.85199 1.282 1.28199 2.852 2.11799 4.224C2.65799 5.11 2.17899 6.266 1.17099 6.511C-0.390006 6.89 -0.390006 9.111 1.17099 9.489C1.40547 9.54581 1.62322 9.65719 1.80651 9.81407C1.98979 9.97096 2.13343 10.1689 2.22573 10.3918C2.31803 10.6147 2.35639 10.8563 2.33766 11.0968C2.31894 11.3373 2.24367 11.5701 2.11799 11.776C1.28199 13.148 2.85199 14.718 4.22399 13.882C4.42993 13.7563 4.66265 13.6811 4.90318 13.6623C5.14371 13.6436 5.38527 13.682 5.60817 13.7743C5.83108 13.8666 6.02904 14.0102 6.18592 14.1935C6.34281 14.3768 6.45419 14.5945 6.51099 14.829C6.88999 16.39 9.11099 16.39 9.48899 14.829C9.54599 14.5946 9.65748 14.377 9.8144 14.1939C9.97132 14.0107 10.1692 13.8672 10.3921 13.7749C10.6149 13.6826 10.8564 13.6442 11.0969 13.6628C11.3373 13.6815 11.57 13.7565 11.776 13.882C13.148 14.718 14.718 13.148 13.882 11.776C13.7565 11.57 13.6815 11.3373 13.6628 11.0969C13.6442 10.8564 13.6826 10.6149 13.7749 10.3921C13.8672 10.1692 14.0107 9.97133 14.1939 9.81441C14.377 9.65749 14.5946 9.546 14.829 9.489C16.39 9.11 16.39 6.889 14.829 6.511C14.5945 6.45419 14.3768 6.34281 14.1935 6.18593C14.0102 6.02904 13.8666 5.83109 13.7743 5.60818C13.682 5.38527 13.6436 5.14372 13.6623 4.90318C13.681 4.66265 13.7563 4.42994 13.882 4.224C14.718 2.852 13.148 1.282 11.776 2.118C11.5701 2.24368 11.3373 2.31895 11.0968 2.33767C10.8563 2.35639 10.6147 2.31804 10.3918 2.22574C10.1689 2.13344 9.97095 1.9898 9.81407 1.80651C9.65718 1.62323 9.5458 1.40548 9.48899 1.171L9.48999 1.17ZM7.99999 11C8.79564 11 9.55871 10.6839 10.1213 10.1213C10.6839 9.55871 11 8.79565 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79564 5 7.99999 5C7.20434 5 6.44128 5.31607 5.87867 5.87868C5.31606 6.44129 4.99999 7.20435 4.99999 8C4.99999 8.79565 5.31606 9.55871 5.87867 10.1213C6.44128 10.6839 7.20434 11 7.99999 11Z"
                        fill="#90A4AE"
                      />
                    </svg>

                    <Typography variant="small" className="font-medium">
                      Edit Profile
                    </Typography>

                  </MenuItem>
                </Link>
                 
                  {
                    user && isAdmin && <Link to={"/dashboard/adminHome"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                          Admin Home
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
                  {
                    user && isModerator && <Link to={"/dashboard/moderator"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                        Moderator Home
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
                  {
                    user && isOwner && <Link to={"/dashboard/ownerHome"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                          Owner Home
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
                  {
                    user && !isAdmin && !isModerator && !isOwner && <Link to={"/dashboard/userHome"}>
                      <MenuItem className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                            fill="#90A4AE"
                          />
                        </svg>

                        <Typography variant="small" className="font-medium">
                           User Home
                        </Typography>
                      </MenuItem>
                    </Link>
                  }
              
                  <hr className="my-2 border-blue-gray-50" />
                  <MenuItem className="flex items-center gap-2">

                    {
                      user ? <>
                        <Typography onClick={handleLogut} variant="small" className="font-medium flex items-center gap-3">
                          <svg
                            width="16"
                            height="14"
                            viewBox="0 0 16 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                              fill="#90A4AE"
                            />
                          </svg>
                          Sign Out
                        </Typography>
                      </> : <>
                        <Link to={"/login"}>
                          <Typography variant="small" className="font-medium flex items-center gap-3">
                            <svg
                              width="16"
                              height="14"
                              viewBox="0 0 16 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                                fill="#90A4AE"
                              />
                            </svg>
                            Sign up
                          </Typography>
                        </Link>
                      </>
                    }
                  </MenuItem>
                </MenuList>
              </Menu>
            </> : <><Link to={"/login"}>
              <button className="btn  text-xl rounded-full border-[#ff1818]  bg-white text-[#ff1818] " ><IoMdLogIn /></button>
            </Link></>
          }
        </div>
      </div>
      {/* Second Navbar */}
      <div className={`navbar  px-3 md:px-6 lg:px-8 bg-[#ff0000d8] ${scrolled ? "fixed top-0 left-0 w-full  shadow z-10 " : ""}`}>
        <div className="navbar-start">
          <div className="dropdown">
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
                          ? "font-extrabold text-[#ff1818] border-b-2 border-red-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-red-600 before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                          : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-red-600 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
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
                        ? "font-extrabold text-[#ff1818] border-b-2 border-red-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-red-600 before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                        : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-red-600 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
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
                          ? "font-extrabold text-[#ff1818] border-b-2 border-red-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-red-600 before:scale-100 before:transition-transform before:duration-300 hover:before:scale-100"
                          : "font-extrabold text-[#ff1818] relative inline-block transition-colors duration-300 before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-full before:h-[2px] before:bg-red-600 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 rounded"
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
                      <div className="badge text-[12px]  text-[#ff0000d8 ">  <p className="flex justify-center items-center gap-3 font-bold "><FaUserCircle /> {user?.displayName}</p></div>

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
                      <span className="badge text-[10px] indicator-item text-[#ff0000d8]">{cartFood.length}</span>
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