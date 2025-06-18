import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaUtensils,
  FaUserCircle,
  FaDollarSign,
  FaStarHalfAlt,
  FaChartBar,
  FaRegUser,
  FaEdit
} from 'react-icons/fa';
import { PiContactlessPaymentLight } from 'react-icons/pi';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const OwnerHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const red = '#ff0000d8';

  const isOwnerHome = location.pathname === '/dashboard/ownerHome';

  // Directly using useQuery without custom hook
  const { data: restaurantData = {} } = useQuery({
    enabled: !!user?.email && isOwnerHome,
    queryKey: ['restaurantData', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/restaurantManage/${user?.email}`);
      return res.data;
    }
  });

  const restaurantName = restaurantData?.restaurantName || 'Your Restaurant';

  const actions = [
    {
      icon: <FaEdit />,
      title: "Edit Profile",
      desc: "Update your personal info and preferences.",
      link: "/myProfile",
    },
    {
      icon: <FaRegUser />,
      title: "Upload Info",
      desc: "Add or update your restaurant and food info.",
      link: "/dashboard/uploadInfo"
    },
    {
      icon: <PiContactlessPaymentLight />,
      title: "Payment History",
      desc: "Check your previous transactions and payouts.",
      link: "/dashboard/paymentHistory"
    },
    {
      icon: <FaUtensils />,
      title: "Manage Menu",
      desc: `Manage ${restaurantName}'s food items.`,
      link: "/dashboard/manageMenu"
    },
    {
      icon: <FaChartBar />,
      title: "Track Orders",
      desc: "Monitor orders, update delivery status, and manage workflow.",
    },
    {
      icon: <FaDollarSign />,
      title: "Revenue Overview",
      desc: "View earnings, payout status, and performance metrics.",
    },
    {
      icon: <FaStarHalfAlt />,
      title: "Customer Feedback",
      desc: "See customer reviews and respond to feedback.",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-red-200">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-10">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Owner Avatar"
              className="w-20 h-20 rounded-full border-2"
              style={{ borderColor: red }}
            />
          ) : (
            <FaUserCircle className="w-20 h-20 text-red-400" />
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name || user?.displayName || 'Restaurant Owner'}!
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm mt-1 font-medium" style={{ color: red }}>
              Role: Food Seller
            </p>
          </div>
        </div>

        <hr className="my-6 border-red-200" />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map(({ icon, title, desc, link }, index) => {
            const card = (
              <div className="bg-red-100 hover:bg-red-200 transition p-5 rounded-xl border shadow-sm border-red-300 h-full">
                <div className="text-3xl mb-2" style={{ color: red }}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
            );

            return link ? (
              <Link to={link} key={index}>
                {card}
              </Link>
            ) : (
              <div key={index}>{card}</div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="bg-[#ff0000d8] hover:bg-[#ff0000] text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
          >
            Go to Home Page
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            You’re logged in as a verified restaurant owner on{' '}
            <span className="font-semibold" style={{ color: red }}>
              Foodhub
            </span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
