import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaPercentage, FaMoneyBillWave, FaCalendarAlt, FaChartLine, FaFileInvoiceDollar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
// import LoadingSpinner from '../../Components/LoadingSpinner';

const COMMISSION_RATE = 0.05; // 5% commission

const RevenueDetails = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const red = '#ff0000d8';

    const { data: revenueData, isLoading } = useQuery({
        queryKey: ['revenueDetails', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/restaurantRevenueDetails/${user?.email}`);
            return res.data;
        }
    });

    // Calculate commission deductions
    const calculateCommission = (amount) => {
        return amount * COMMISSION_RATE;
    };

    const calculateNetAmount = (amount) => {
        return amount - calculateCommission(amount);
    };

    // Sample data for the chart
    const chartData = [
        { name: 'Mon', gross: 400, net: 380, commission: 20 },
        { name: 'Tue', gross: 600, net: 570, commission: 30 },
        { name: 'Wed', gross: 300, net: 285, commission: 15 },
        { name: 'Thu', gross: 800, net: 760, commission: 40 },
        { name: 'Fri', gross: 1200, net: 1140, commission: 60 },
        { name: 'Sat', gross: 1500, net: 1425, commission: 75 },
        { name: 'Sun', gross: 900, net: 855, commission: 45 },
    ];

    if (isLoading) return <div className="flex justify-center items-center min-h-screen">
        <img
            src="https://i.ibb.co.com/F57mtch/logo2.png"
            alt="Loading Logo"
            className="w-28 h-28 object-contain animate-pulse"
        />

    </div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 border border-red-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaMoneyBillWave className="mr-2" style={{ color: red }} />
                    Revenue Dashboard
                    <span className="ml-auto text-sm font-normal bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center">
                        <FaPercentage className="mr-1" /> 5% FoodHub Commission
                    </span>
                </h1>

                {/* Commission Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                FoodHub deducts a <strong>5% commission fee</strong> from each transaction. Below amounts show your net earnings after commission.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600">Net Revenue</p>
                                <p className="text-2xl font-bold">${calculateNetAmount(revenueData?.totalRevenue || 0).toFixed(2)}</p>
                                <p className="text-xs text-gray-500">
                                    Gross: ${revenueData?.totalRevenue?.toFixed(2) || '0.00'} • Commission: ${calculateCommission(revenueData?.totalRevenue || 0).toFixed(2)}
                                </p>
                            </div>
                            <FaMoneyBillWave className="text-3xl" style={{ color: red }} />
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600">This Month (Net)</p>
                                <p className="text-2xl font-bold">${calculateNetAmount(revenueData?.monthlyEarnings || 0).toFixed(2)}</p>
                                <p className="text-xs text-gray-500">
                                    Gross: ${revenueData?.monthlyEarnings?.toFixed(2) || '0.00'} • Commission: ${calculateCommission(revenueData?.monthlyEarnings || 0).toFixed(2)}
                                </p>
                            </div>
                            <FaCalendarAlt className="text-3xl" style={{ color: red }} />
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600">Available Balance</p>
                                <p className="text-2xl font-bold">${calculateNetAmount(revenueData?.availableBalance || 0).toFixed(2)}</p>
                                <p className="text-xs text-gray-500">
                                    Before commission: ${revenueData?.availableBalance?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <FaFileInvoiceDollar className="text-3xl" style={{ color: red }} />
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600">Avg. Order (Net)</p>
                                <p className="text-2xl font-bold">${calculateNetAmount(revenueData?.averageOrderValue || 0).toFixed(2)}</p>
                                <p className="text-xs text-gray-500">
                                    Gross average: ${revenueData?.averageOrderValue?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <FaChartLine className="text-3xl" style={{ color: red }} />
                        </div>
                    </div>
                </div>

                {/* Commission Breakdown Chart */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Weekly Revenue Breakdown (Gross vs Net)</h2>
                    <div className="h-64 bg-white p-4 rounded-lg border border-red-200">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) => [
                                        `$${value.toFixed(2)}`,
                                        name === 'commission' ? 'FoodHub Commission' : name === 'gross' ? 'Gross Revenue' : 'Your Net'
                                    ]}
                                />
                                <Legend
                                    formatter={(value) =>
                                        value === 'commission' ? 'FoodHub Commission' : value === 'gross' ? 'Gross Revenue' : 'Your Net'
                                    }
                                />
                                <Bar dataKey="gross" fill="#8884d8" name="Gross Revenue" />
                                <Bar dataKey="net" fill={red} name="Your Net" />
                                <Bar dataKey="commission" fill="#ffc658" name="FoodHub Commission" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transaction History with Commission */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Recent Transactions (With Commission)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-red-200">
                            <thead>
                                <tr className="bg-red-50">
                                    <th className="py-2 px-4 border-b text-left">Date</th>
                                    <th className="py-2 px-4 border-b text-left">Order ID</th>
                                    <th className="py-2 px-4 border-b text-left">Gross</th>
                                    <th className="py-2 px-4 border-b text-left">Commission</th>
                                    <th className="py-2 px-4 border-b text-left">Net</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.recentTransactions?.map((transaction, index) => {
                                    const commission = calculateCommission(transaction.amount);
                                    const netAmount = calculateNetAmount(transaction.amount);

                                    return (
                                        <tr key={index} className="hover:bg-red-50">
                                            <td className="py-2 px-4 border-b">{new Date(transaction.date).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 border-b">{transaction.orderId}</td>
                                            <td className="py-2 px-4 border-b">${transaction.amount.toFixed(2)}</td>
                                            <td className="py-2 px-4 border-b text-red-500">-${commission.toFixed(2)}</td>
                                            <td className="py-2 px-4 border-b font-semibold">${netAmount.toFixed(2)}</td>
                                            <td className="py-2 px-4 border-b">
                                                <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) || (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payout History */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Payout History (Net Amounts)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-red-200">
                            <thead>
                                <tr className="bg-red-50">
                                    <th className="py-2 px-4 border-b text-left">Date</th>
                                    <th className="py-2 px-4 border-b text-left">Payout ID</th>
                                    <th className="py-2 px-4 border-b text-left">Net Amount</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData?.payoutHistory?.map((payout, index) => (
                                    <tr key={index} className="hover:bg-red-50">
                                        <td className="py-2 px-4 border-b">{new Date(payout.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">{payout.payoutId}</td>
                                        <td className="py-2 px-4 border-b font-semibold">${payout.amount.toFixed(2)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-2 py-1 rounded-full text-xs ${payout.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{payout.method}</td>
                                    </tr>
                                )) || (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-gray-500">
                                                No payout history found
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueDetails;