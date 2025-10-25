import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { FaUserCircle, FaShoppingBag, FaEdit, FaSignInAlt } from "react-icons/fa";
import { PiContactlessPaymentLight } from "react-icons/pi";

const UserHome = () => {
  const { user } = useAuth();
  const red = "#ff1818";


  const actions = [
    {
      icon: <FaShoppingBag />,
      title: "My Orders",
      desc: "View your recent food orders and delivery status.",
      link: "/dashboard/myOrder",
    },
    {
      icon: <FaEdit />,
      title: "Edit Profile",
      desc: "Update your personal info and preferences.",
      link: "/myProfile",
    },
    {
      icon: <PiContactlessPaymentLight />,
      title: "Payment History",
      desc: "Review your payment and transaction history.",
      link: "/dashboard/paymentHistory",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-red-50 rounded-2xl drop-shadow-2xl" >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-7xl w-full text-gray-800"
        style={{ border: `2px solid ${red}` }}
      >
        {user ? (
          <>
            {/* Header */}
            <div className="flex items-center mb-6 space-x-4">
              {
                user ? <>
                  <img src={user.photoURL} className="w-14 h-14" alt="" />
                </> : <>
                  <FaUserCircle className="text-5xl" style={{ color: red }} />
                </>
              }
              <div>
                <h2 className="text-2xl font-bold">
                  Hello, {user?.name || user?.displayName}!
                </h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <span
                  className="text-xs font-medium mt-1 inline-block"
                  style={{ color: red }}
                >
                  Role: User
                </span>
              </div>
            </div>

            {/* Action Buttons Grid */}
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

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Thanks for being a valued user of{" "}
                <span className="font-semibold" style={{ color: red }}>
                  Foodhub
                </span>{" "}
                ❤️
              </p>
            </div>
            <div className="mt-10 text-center">
              <Link to={"/"}
                className="bg-[#ff1818] hover:bg-[#ff0000] text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
              >
                Go to Home Page
              </Link>
              <p className="text-sm text-gray-500 mt-3">
                You're User on <span className="font-semibold" style={{ color: red }}>Foodhub</span> — helping maintain quality and trust.
              </p>
            </div>
          </>
        ) : (
          // Not Logged In Message
          <div className="text-center py-16">
            <FaSignInAlt className="text-6xl mb-4 mx-auto" style={{ color: red }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#cc0000" }}>
              You're not logged in
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to access your Foodhub user dashboard.
            </p>
            <Link to={"/login"}>
              <button
                aria-label="Login Now"
                className="bg-[#ff1818] hover:bg-[#ff1818] text-white px-6 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-600"
             
              >
                Login Now
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
