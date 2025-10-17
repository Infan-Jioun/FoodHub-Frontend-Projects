import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUtensils, FaUserCircle, FaDollarSign, FaStarHalfAlt, FaChartBar, FaRegUser, FaEdit } from 'react-icons/fa';
import { PiContactlessPaymentLight } from 'react-icons/pi';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const OwnerHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const red = '#ff1818';

  const isOwnerHome = location.pathname === '/dashboard/ownerHome';

  // Fetch restaurant data
  const { data: restaurantData = {} } = useQuery({
    enabled: !!user?.email && isOwnerHome,
    queryKey: ['restaurantData', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/restaurantManage/${user?.email}`);
      return res.data;
    }
  });


  const { data: revenueData = {}, isLoading: revenueLoading } = useQuery({
    enabled: !!user?.email && isOwnerHome,
    queryKey: ['revenueData', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/restaurantRevenue/${user?.email}`);
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
      link: "/dashboard/orders"
    },
    {
      icon: <FaDollarSign />,
      title: "Revenue Overview",
      desc: (
        <div className="mt-2">
          {revenueLoading ? (
            <div className="text-center py-2">Loading revenue data...</div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span>Today's Earnings:</span>
                <span className="font-semibold">${revenueData?.todayEarnings?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>This Month:</span>
                <span className="font-semibold">${revenueData?.monthlyEarnings?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Total Balance:</span>
                <span className="font-semibold">${revenueData?.totalBalance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="text-xs mt-2 text-center text-gray-600">
                {revenueData?.lastPayoutDate
                  ? `Last payout: ${new Date(revenueData.lastPayoutDate).toLocaleDateString()}`
                  : 'No payouts yet'}
              </div>
            </>
          )}
        </div>
      ),
      link: "/dashboard/revenueDetails"
    },
    {
      icon: <FaStarHalfAlt />,
      title: "Customer Feedback",
      desc: "See customer reviews and respond to feedback.",
      link: "/dashboard/reviews"
    }
  ];

  return (
    <div className="min-h-screen bg-red-50 p-6 md:p-10 rounded-2xl drop-shadow-2xl">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-red-200">

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
            <FaUserCircle className="w-20 h-20 bg-[#ff1818]" />
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name || user?.displayName || 'Restaurant Owner'}!
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm mt-1 font-medium" style={{ color: red }}>
              Role: Food Seller
            </p>
            <p className="text-sm mt-1 font-medium text-gray-600">
              Restaurant: {restaurantName}
            </p>
          </div>
        </div>

        <hr className="my-6 border-red-200" />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map(({ icon, title, desc, link }, index) => {
            const card = (
              <div
                className="bg-red-100 hover:bg-red-200 transition p-5 rounded-xl border shadow-sm border-red-300 h-full flex flex-col"
                key={index}
              >
                <div className="text-3xl mb-2" style={{ color: red }}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <div className="text-sm text-gray-700 mt-1 flex-grow">
                  {typeof desc === 'string' ? desc : desc}
                </div>
                {link && (
                  <div className="mt-3 text-right">
                    <span className="text-xs font-semibold" style={{ color: red }}>View details →</span>
                  </div>
                )}
              </div>
            );

            return link ? (
              <Link to={link} key={index}>
                {card}
              </Link>
            ) : (
              card
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="bg-[#ff1818] hover:bg-[#ff0000] text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
          >
            Go to Home Page
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            You're logged in as a verified restaurant owner on{' '}
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