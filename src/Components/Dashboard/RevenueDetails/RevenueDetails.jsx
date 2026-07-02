import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaPercentage, FaMoneyBillWave, FaHistory, FaReceipt } from 'react-icons/fa';
import { MdFastfood, MdRestaurant } from 'react-icons/md';

const RevenueDetails = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const red = '#ff1818';

    const { data: paymentResponse = { data: [], totals: {} }, isLoading } = useQuery({
        queryKey: ['restaurantPayments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/restaurant-payments/${user?.email}`);
            return res.data; // ← interceptor already unwrap kore dey: { data: [...], totals: {...} }
        },
        enabled: !!user?.email
    });

    const { data: payments = [], totals = {} } = paymentResponse;
    const { totalSales = 0, totalCommission = 0, totalEarnings = 0 } = totals;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex justify-center items-center min-h-screen">
                    <img
                        src="https://i.ibb.co.com/F57mtch/logo2.png"
                        alt="Loading Logo"
                        className="w-28 h-28 object-contain animate-pulse"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6 md:p-10">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-red-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaMoneyBillWave className="mr-2" style={{ color: red }} /> Revenue Details
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-red-100 p-6 rounded-xl border border-red-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
                                <p className="text-2xl font-bold mt-2">${totalSales.toFixed(2)}</p>
                            </div>
                            <MdFastfood className="text-3xl" style={{ color: red }} />
                        </div>
                    </div>

                    <div className="bg-red-100 p-6 rounded-xl border border-red-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Foodhub Commission (5%)</h3>
                                <p className="text-2xl font-bold mt-2">${totalCommission.toFixed(2)}</p>
                            </div>
                            <FaPercentage className="text-3xl" style={{ color: red }} />
                        </div>
                    </div>

                    <div className="bg-red-100 p-6 rounded-xl border border-red-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Your Earnings</h3>
                                <p className="text-2xl font-bold mt-2">${totalEarnings.toFixed(2)}</p>
                            </div>
                            <MdRestaurant className="text-3xl" style={{ color: red }} />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaHistory className="mr-2" style={{ color: red }} /> Transaction History
                    </h2>

                    {payments.length === 0 ? (
                        <div className="text-center py-10 bg-red-50 rounded-lg">
                            <p className="text-gray-600">No transactions found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-red-200">
                                <thead className="bg-red-100">
                                    <tr>
                                        <th className="py-3 px-4 border-b text-left">Date</th>
                                        <th className="py-3 px-4 border-b text-left">Order ID</th>
                                        <th className="py-3 px-4 border-b text-left">Customer</th>
                                        <th className="py-3 px-4 border-b text-left">Items</th>
                                        <th className="py-3 px-4 border-b text-right">Amount</th>
                                        <th className="py-3 px-4 border-b text-right">Commission</th>
                                        <th className="py-3 px-4 border-b text-right">Earnings</th>
                                        <th className="py-3 px-4 border-b text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment, index) => {
                                        const amount = payment.items?.reduce((sum, item) => {
                                            const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                                            const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1;
                                            return sum + (price * quantity);
                                        }, 0) || 0;

                                        const commission = amount * 0.05;
                                        const earnings = amount - commission;
                                        const date = new Date(payment.date).toLocaleDateString();

                                        return (
                                            <tr key={index} className="hover:bg-red-50">
                                                <td className="py-3 px-4 border-b">{date}</td>
                                                <td className="py-3 px-4 border-b">
                                                    <span className="text-xs font-mono">
                                                        {payment._id?.substring(0, 6) || 'N/A'}...
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b">{payment.customerName}</td>
                                                <td className="py-3 px-4 border-b">
                                                    {payment.items?.map((item, i) => (
                                                        <div key={i} className="text-sm">
                                                            {item.foodName} (x{item.quantity || 1})
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-3 px-4 border-b text-right">${amount.toFixed(2)}</td>
                                                <td className="py-3 px-4 border-b text-right">-${commission.toFixed(2)}</td>
                                                <td className="py-3 px-4 border-b text-right font-semibold" style={{ color: red }}>
                                                    ${earnings.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'success'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-300">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <FaReceipt className="text-2xl mr-2" style={{ color: red }} />
                            <h3 className="text-lg font-semibold">Payment Summary</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-right">
                            <div>
                                <p className="text-sm text-gray-600">Total Transactions</p>
                                <p className="text-xl font-bold">{payments.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Commission</p>
                                <p className="text-xl font-bold">${totalCommission.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Net Earnings</p>
                                <p className="text-xl font-bold" style={{ color: red }}>${totalEarnings.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueDetails;