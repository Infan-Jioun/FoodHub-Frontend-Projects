import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    BarChart, Bar,
} from "recharts";
import useAllUserHooks from "../../Hooks/useAllUserHooks";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const Revenue = () => {
    const red = "#ff0000d8";

    // Custom hook for users
    const [users, isLoading, refetch] = useAllUserHooks();
    const axiosSecure = useAxiosSecure();

    const [summary, setSummary] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [dailyRevenue, setDailyRevenue] = useState([]);

    useEffect(() => {
        refetch(); // Refetch user data
        axiosSecure.get("/revenue-summary").then(res => setSummary(res.data));
        axiosSecure.get("/revenue-by-month").then(res => setMonthlyRevenue(res.data));
        axiosSecure.get("/top-items").then(res => setTopItems(Array.isArray(res.data) ? res.data : []));
        axiosSecure.get("/daily-revenue").then(res => setDailyRevenue(Array.isArray(res.data) ? res.data : []));
    }, [axiosSecure, refetch]);

    if (!summary) return <p className="text-center py-10">  <div className="flex justify-center items-center min-h-screen">
        <img
            src="https://i.ibb.co.com/F57mtch/logo2.png"
            alt="Loading Logo"
            className="w-28 h-28 object-contain animate-pulse"
        />

    </div></p>;

    const ownerCount = users?.filter(user => user.role === "owner").length || 0;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center font-Caveat" style={{ color: red }}>
                Revenue Dashboard
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {[
                    { title: "Total Revenue", value: `$${Number(summary?.totalRevenue || 0).toFixed(2)}` },
                    { title: "Total Orders", value: summary?.totalOrders || 0 },
                    { title: "Total Users", value: users?.length || 0 },
                    { title: "Avg Order", value: `$${Number(summary?.averageOrder || 0).toFixed(2)}` },
                    { title: "Total Owners", value: ownerCount },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-md text-center"
                    >
                        <h4 className="text-lg font-semibold text-gray-700">{item.title}</h4>
                        <p className="text-xl font-bold" style={{ color: red }}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-white p-6 rounded-xl border border-red-200 shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke={red} strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Daily Revenue Chart */}
            <div className="bg-white p-6 rounded-xl border border-red-200 shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">Last 7 Days Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill={red} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white p-6 rounded-xl border border-red-200 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {topItems.map((item, i) => (
                        <div
                            key={i}
                            className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm"
                        >
                            <h4 className="font-bold text-[red]">{item.foodName}</h4>
                            <p className="text-sm text-gray-600">Total Sold: {item.quantity}</p>
                            <p className="text-sm text-gray-600">
                                Revenue: ${Number(item.totalRevenue || 0).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                                Restaurant: {item?.restaurantName}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-10 mb-5 text-center">
                <Link to={"/"}
                    className="bg-[#ff0000d8] hover:bg-[#ff0000] text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
                >
                    Go to Home Page
                </Link>

            </div>
        </div>
    );
};

export default Revenue;
