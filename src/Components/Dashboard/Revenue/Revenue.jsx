import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import useAllUserHooks from "../../Hooks/useAllUserHooks";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FaMoneyBillWave, FaStore, FaPercentage, FaClipboardList, FaUtensils } from "react-icons/fa";

const Revenue = () => {
  // Color scheme
  const colors = {
    red: "#ff1818",
    blue: "#0088fed8",
    
    orange: "#ff9900d8",
    purple: "#9900ffd8"
  };

  // State management
  const [users] = useAllUserHooks();
  const axiosSecure = useAxiosSecure();
  const [summary, setSummary] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [
          summaryRes, 
          monthlyRes, 
          topItemsRes, 
          dailyRes
        ] = await Promise.all([
          axiosSecure.get("/revenue-summary"),
          axiosSecure.get("/revenue-by-month"),
          axiosSecure.get("/top-items"),
          axiosSecure.get("/daily-revenue")
        ]);

        // Debug logging
        console.log("Revenue Summary:", summaryRes.data);
        console.log("Monthly Revenue:", monthlyRes.data);
        
        setSummary(summaryRes.data);
        setMonthlyRevenue(monthlyRes.data || []);
        setTopItems(Array.isArray(topItemsRes.data) ? topItemsRes.data : []);
        setDailyRevenue(Array.isArray(dailyRes.data) ? dailyRes.data : []);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load revenue data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <img
          src="https://i.ibb.co.com/F57mtch/logo2.png"
          alt="Loading Logo"
          className="w-28 h-28 object-contain animate-pulse"
        />
      
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="bg-red-100 border border-red-400 text-[#ff1818] px-4 py-3 rounded max-w-md">
          <h3 className="font-bold text-lg">Error</h3>
          <p className="mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#ff1818] hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Data not available
  if (!summary) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md">
          <h3 className="font-bold text-lg">No Data Available</h3>
          <p>Revenue data could not be loaded. Please check back later.</p>
        </div>
      </div>
    );
  }

  const ownerCount = users?.filter(user => user.role === "owner").length || 0;

  // Calculate expected commission if backend isn't providing it
  const calculatedCommission = summary.totalRevenue * 0.05;
  const calculatedRestaurantRevenue = summary.totalRevenue * 0.95;

  // Summary card data
  const summaryCards = [
    { 
      title: "Total Revenue", 
      value: `$${(summary.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: colors.red
    },
    { 
      title: "Total Orders", 
      value: summary.totalOrders || 0,
      icon: <FaClipboardList className="text-2xl" />,
      color: colors.blue
    },
    { 
      title: "Platform Commission", 
      value: `$${(summary.totalCommission || calculatedCommission).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: "(5% of revenue)",
      icon: <FaPercentage className="text-2xl" />,
      color: colors.red
    },
    { 
      title: "Restaurant Revenue", 
      value: `$${(summary.restaurantRevenue || calculatedRestaurantRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: "(95% of revenue)",
      icon: <FaStore className="text-2xl" />,
      color: colors.orange
    },
    { 
      title: "Total Restaurants", 
      value: ownerCount,
      icon: <FaUtensils className="text-2xl" />,
      color: colors.purple
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Fallback data formatter
  const formatChartData = (data) => {
    return data.map(item => ({
      ...item,
      // Ensure commission and restaurant revenue exist
      commission: item.commission || (item.revenue * 0.05),
      restaurantRevenue: item.restaurantRevenue || (item.revenue * 0.95)
    }));
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: colors.red }}>
        Revenue Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            style={{ borderColor: card.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm md:text-base font-semibold text-gray-700">{card.title}</h4>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <p className="text-xl md:text-2xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
            {card.subtext && (
              <p className="text-xs text-gray-500 mt-1">{card.subtext}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatChartData(monthlyRevenue)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Total Revenue"
                  stroke={colors.red} 
                  strokeWidth={3} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="restaurantRevenue" 
                  name="Restaurant (95%)"
                  stroke={colors.red} 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  name="Platform (5%)"
                  stroke={colors.blue} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Revenue Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days Revenue</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatChartData(dailyRevenue)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="revenue" 
                  name="Total Revenue"
                  fill={colors.red} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="restaurantRevenue" 
                  name="Restaurant (95%)"
                  fill={colors.red} 
                />
                <Bar 
                  dataKey="commission" 
                  name="Platform (5%)"
                  fill={colors.blue} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="text-lg font-semibold">Top Selling Menu Items</h3>
          <span className="text-sm text-gray-500">
            Showing top {topItems.length} items by quantity sold
          </span>
        </div>
        
        {topItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topItems.map((item, i) => {
              // Calculate commission if missing
              const totalRevenue = item.totalRevenue || 0;
              const platformCommission = item.platformCommission || (totalRevenue * 0.05);
              const restaurantRevenue = item.restaurantRevenue || (totalRevenue * 0.95);

              return (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:shadow transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg" style={{ color: colors.red }}>
                        {item.foodName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        From: {item?.restaurantName || "Unknown Restaurant"}
                      </p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      #{i + 1}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <StatBox 
                      label="Quantity Sold" 
                      value={item.quantity} 
                      color={colors.blue}
                    />
                    <StatBox 
                      label="Total Revenue" 
                      value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                      color={colors.red}
                    />
                    <StatBox 
                      label="Platform (5%)" 
                      value={`$${platformCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                      color={colors.red}
                    />
                    <StatBox 
                      label="Restaurant (95%)" 
                      value={`$${restaurantRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                      color={colors.orange}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
            No top selling items data available
          </div>
        )}
      </div>

      <div className="mt-8 mb-4 text-center">
        <Link 
          to="/dashboard/adminHome"
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow transition-all hover:scale-[1.02]"
        >
          <FaStore />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

// Reusable stat box component
const StatBox = ({ label, value, color }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium" style={{ color }}>{value}</p>
  </div>
);

export default Revenue;