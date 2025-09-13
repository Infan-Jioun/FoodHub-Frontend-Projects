import React, { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaStripe, FaMoneyBillWave, FaReceipt, FaTrash } from 'react-icons/fa';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import FoodReviewModal from '../Review/FoodReviewModal';
// You can create this like FoodReviewModal
import RestaurantReviewModal from '../Review/RestaurantReviewModal';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isFoodReviewOpen, setIsFoodReviewOpen] = useState(false);
  const [isRestaurantReviewOpen, setIsRestaurantReviewOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/payments?email=${encodeURIComponent(user.email)}`);
        setPayments(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.email, axiosSecure]);

  const getPaymentGatewayIcon = (transactionId, title) => {
    if (!transactionId && !title) return null;
    if (transactionId?.startsWith("pi_") || title?.includes("Stripe")) {
      return (
        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FaStripe className="mr-1" /> Stripe
        </div>
      );
    }
    if (transactionId?.includes("ssl") || title?.includes("SSLCommerz")) {
      return (
        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaMoneyBillWave className="mr-1" /> SSLCommerz
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> {status}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiClock className="mr-1" /> {status}
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || 'Unknown'}
          </span>
        );
    }
  };

 

  // Review handlers
  const handleOpenFoodReview = (payment) => {
    setSelectedPayment(payment);
    setIsFoodReviewOpen(true);
  };

  const handleOpenRestaurantReview = (payment) => {
    setSelectedPayment(payment);
    setIsRestaurantReviewOpen(true);
  };

  const handleCloseModals = () => {
    setIsFoodReviewOpen(false);
    setIsRestaurantReviewOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#ff1818]">Payment History</h1>
            <p className="text-gray-600">View your past transactions and orders</p>
          </div>
          <div className="bg-[#ff00001a] p-3 rounded-lg shadow-sm border border-[#ff1818] mt-4 sm:mt-0">
            <div className="flex items-center">
              <FaReceipt className="text-[#ff1818] text-xl mr-2" />
              <span className="font-medium text-[#ff1818]">{payments.length} transactions</span>
            </div>
          </div>
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-white"
          >
            <motion.img
              src="https://i.ibb.co.com/F57mtch/logo2.png"
              alt="Logo"
              className="w-28 h-28"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-[#ff1818] p-4 rounded-lg">
            <div className="flex">
              <FiXCircle className="h-5 w-5 text-[#ff1818] mr-2" />
              <p className="text-sm text-[#ff1818]">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <div className="text-center py-12">
            <FaReceipt className="mx-auto text-gray-400 text-6xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No payment history</h3>
            <p className="text-sm text-gray-500">Your completed transactions will appear here.</p>
          </div>
        )}

        {!loading && !error && payments.length > 0 && (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white p-6 rounded-xl shadow-sm border border-[#ff000010] hover:border-[#ff1818] transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      Order #{payments.indexOf(payment) + 1} <span className="ml-2">{getStatusBadge(payment.status)}</span>
                    </h3>
                    <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">${Number(payment.foodPrice).toFixed(2)}</p>
                      {getPaymentGatewayIcon(payment.transactionId, payment.title)}
                    </div>
               
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {payment.items?.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">{item.foodName}</h4>
                            <p className="text-xs text-gray-500">From: {item.restaurantName}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleOpenFoodReview(payment)}
                      className="text-sm text-[#ff1818] underline hover:text-[#ff1818]"
                    >
                      Review Food
                    </button>
                    <button
                      onClick={() => handleOpenRestaurantReview(payment)}
                      className="text-sm text-[#ff1818] underline hover:text-[#ff1818]"
                    >
                      Review Restaurant
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <FoodReviewModal
        open={isFoodReviewOpen}
        onClose={handleCloseModals}
        payment={selectedPayment}
      />
      <RestaurantReviewModal
        open={isRestaurantReviewOpen}
        onClose={handleCloseModals}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentHistory;
