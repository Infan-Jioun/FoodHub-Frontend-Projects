import React, { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaStripe, FaMoneyBillWave } from 'react-icons/fa';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosSecure.get(`/payments?email=${encodeURIComponent(user.email)}`);
        setPayments(response.data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.email, axiosSecure]);

  // Get gateway icon and label
  const getPaymentGatewayIcon = (transactionId, title) => {
    if (!transactionId && !title) return null;

    if (transactionId?.startsWith("pi_") || title?.includes("Stripe")) {
      return (
        <span title="Stripe" className="flex items-center gap-1 ml-2 text-blue-600">
          <FaStripe /> <span className="text-xs font-medium">Stripe</span>
        </span>
      );
    }

    if (
      transactionId?.startsWith("ssl_") ||
      transactionId?.includes("sslcommerz") ||
      title?.includes("SSLCommerz")
    ) {
      return (
        <span title="SSLCommerz" className="flex items-center gap-1 ml-2 text-green-600">
          <FaMoneyBillWave /> <span className="text-xs font-medium">SSLCommerz</span>
        </span>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
        {loading && (
          <p className="text-gray-500 text-center py-16 text-lg font-medium animate-pulse">
            Loading payment history...
          </p>
        )}

        {error && (
          <p className="text-red-600 text-center py-16 text-lg font-semibold">
            {error}
          </p>
        )}

        {!loading && !error && payments.length === 0 && (
          <p className="text-gray-500 text-center py-16 text-lg">
            No payment history available.
          </p>
        )}

        {!loading && !error && payments.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount (USD)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map(({ transactionId, date, foodPrice, status, title }) => (
                  <tr key={transactionId + date} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      ${Number(foodPrice ?? 0).toFixed(2)}
                    </td>

                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      status?.toLowerCase() === 'completed'
                        ? 'text-green-600 bg-green-100 rounded-full px-3 py-1 inline-block'
                        : status?.toLowerCase() === 'failed'
                        ? 'text-red-600 bg-red-100 rounded-full px-3 py-1 inline-block'
                        : 'rounded-full px-3 py-1 inline-block'
                    }`}>
                      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600 max-w-[250px]">
                      <div className="flex flex-col gap-1">
                        <span className="truncate">{transactionId || "N/A"}</span>
                        {getPaymentGatewayIcon(transactionId, title)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
