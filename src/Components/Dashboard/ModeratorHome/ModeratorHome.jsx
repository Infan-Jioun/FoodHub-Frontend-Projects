import React from 'react';
import useAuth from '../../Hooks/useAuth';
import {
  FaUserShield,
  FaFlag,
  FaCheckCircle,
  FaCommentDots,
  FaUserEdit,
  FaEdit,
  FaUsers
} from 'react-icons/fa';
import { PiContactlessPaymentLight } from 'react-icons/pi';
import { MdOutlineAddModerator } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { GoUpload } from 'react-icons/go';

const ModeratorHome = () => {
  const { user } = useAuth();
  const red = '#ff0000d8';

  const cards = [
    {
      icon: <FaEdit />,
      title: "Edit Profile",
      desc: "Update your personal info and preferences.",
      link: "/myProfile",
    },
    {
      icon: <GoUpload />,
      title: "Upload Info",
      desc: "Submit or edit restaurant or menu info.",
      link: "/dashboard/uploadInfo"
    },
    {
      icon: <FaUsers />,
      title: "Manage Users",
      link: "/dashboard/users",
      desc: "Control user roles, access, and permissions.",
    },
    {
      icon: <PiContactlessPaymentLight />,
      title: "Payment History",
      desc: "Check payment and transaction records.",
      link: "/dashboard/paymentHistory"
    },
    {
      icon: <FaCheckCircle />,
      title: "Approve Listings",
      desc: "Review restaurant and food item submissions.",
      link: "#" // Replace with actual route if needed
    },
    {
      icon: <FaFlag />,
      title: "Handle Reports",
      desc: "Resolve content or user abuse reports.",
      link: "#" // Replace with actual route if needed
    },
    
  
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-red-300">
        
        {/* Moderator Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-10">
          <FaUserShield className="w-16 h-16 mb-4 sm:mb-0" style={{ color: red }} />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Hello, {user?.name || user?.displayName || 'Moderator'} 👋
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm mt-1 font-semibold" style={{ color: red }}>
              Role: Moderator
            </p>
          </div>
        </div>

        <hr className="my-6 border-red-200" />

        {/* Moderator Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ icon, title, desc, link }, index) => (
            <Link to={link} key={index}>
              <div className="bg-red-100 hover:bg-red-200 transition duration-200 p-5 rounded-xl border border-red-300 shadow-sm h-full">
                <div className="text-3xl mb-2" style={{ color: red }}>{icon}</div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link to={"/"}
            className="bg-[#ff0000d8] hover:bg-[#ff0000] text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
          >
            Go to Home Page 
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            You're moderating on <span className="font-semibold" style={{ color: red }}>Foodhub</span> — helping maintain quality and trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeratorHome;
