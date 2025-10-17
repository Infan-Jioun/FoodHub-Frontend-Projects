import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";

import {
  FaUserShield,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaRegUser,
  FaEdit,
} from "react-icons/fa";
import { PiContactlessPaymentLight } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { GoUpload } from "react-icons/go";
import { CiSquarePlus } from "react-icons/ci";

const AdminHome = () => {
  const { user } = useAuth();
  const red = "#ff1818";

  const actions = [
    {
      icon: <FaEdit />,
      title: "Edit Profile",
      desc: "Update your personal info and preferences.",
      link: "/myProfile",
    },
    {
      icon: <GoUpload />,
      title: "Upload Info",
      link: "/dashboard/uploadInfo",
      desc: "Add restaurant or menu information.",
    }, {
      icon: <BsLayoutTextSidebarReverse />,
      title: "Revenue Report",
      link: "/dashboard/revenue",
      desc: "Track earnings, profits, and financial trends.",
    },
    {
      icon: <CiSquarePlus />,
      title: "Add District Collection",
      link: "/dashboard/addDistrictCollection",
      desc: "Upload district-based collections.",
    },
    {
      icon: <PiContactlessPaymentLight />,
      title: "Payment History",
      link: "/dashboard/paymentHistory",
      desc: "Check past payments and transactions.",
    },
    {
      icon: <FaUsers />,
      title: "Manage Users",
      link: "/dashboard/users",
      desc: "Control user roles, access, and permissions.",
    },
    {
      icon: <FaChartLine />,
      title: "Analytics",
      link: "https://analytics.google.com/analytics/web/?authuser=0#/p492302089/reports/intelligenthome?params=_u..nav%3Dmaui",
      desc: "Monitor app performance, growth, and user activity.",
    },
    {
      icon: <FaClipboardList />,
      title: "Manage Orders",
      link: "/dashboard/myOrder",
      desc: "Oversee and update all restaurant orders.",
    },
   
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-red-50 rounded-2xl drop-shadow-2xl">
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-7xl w-full text-gray-800"
        style={{ border: `2px solid ${red}` }}
      >
        {/* Admin Info */}
        <div className="flex items-center mb-8 space-x-5">
          <FaUserShield className="text-6xl" style={{ color: red }} />
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold drop-shadow-2xl">
              Welcome Admin, {user?.name || user?.displayName}
            </h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <span
              className="text-xs font-semibold mt-1 inline-block"
              style={{ color: red }}
            >
              Role: Admin
            </span>
          </div>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map(({ icon, title, desc, link }, i) => {
            const card = (
              <div
                className="bg-red-50 p-6  rounded-xl border border-red-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full"
                style={{ borderColor: red }}
              >
                <div className="text-3xl mb-3" style={{ color: red }}>
                  {icon}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-gray-700 text-[11px] font-medium mt-1">{desc}</p>
              </div>
            );

            return link ? (
              <Link to={link} key={i} target={link.startsWith("http") ? "_blank" : "_self"}>
                {card}
              </Link>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-600">
          <div className="mt-10 mb-5 text-center">
            <Link to={"/"}
              className="bg-[#ff1818] hover:bg-[#ff0000] text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
            >
              Go to Home Page
            </Link>

          </div>
          <p>
            You're managing{" "}
            <span className="font-semibold" style={{ color: red }}>
              Foodhub
            </span>{" "}
            — thank you for keeping it awesome! 
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
