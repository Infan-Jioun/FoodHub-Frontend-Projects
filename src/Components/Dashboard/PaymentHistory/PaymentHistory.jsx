import React, { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaStripe, FaMoneyBillWave, FaReceipt, FaStar, FaTrash } from 'react-icons/fa';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Rating } from '@material-tailwind/react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFood, setSelectedFood] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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

  const openReviewModal = (foodItem) => {
    setSelectedFood(foodItem);
    setRating(5);
    setComment('');
    document.getElementById('review_modal').showModal();
  };

  const handleSubmitReview = async () => {
    if (!selectedFood || !rating || !comment) return;
    setSubmitting(true);
    const reviewData = {
      user: user?.displayName,
      email: user?.email,
      rating,
      comment,
      date: new Date(),
    };
    try {
      const res = await axiosSecure.patch(
        `/restaurantUpload/${selectedFood.restaurantName}/${selectedFood.foodName}`,
        { reviewData }
      );
      if (res.data.success) {
        toast.success("Review submitted successfully!");
      } else {
        toast.error("Failed to submit review.");
      }
    } catch {
      toast.error("An error occurred while submitting your review.");
    } finally {
      setSubmitting(false);
      document.getElementById('review_modal').close();
    }
  };

  const handleDelete = async (paymentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: " Deleted ? ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff0000d8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/payments/${paymentId}`).then(() => {

          toast.success("Deleted successfully.");
          setPayments(payments.filter(payment => payment._id !== paymentId));
        });
      }
    });

  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#ff0000d8]">Payment History</h1>
            <p className="text-gray-600">View your past transactions and orders</p>
          </div>
          <div className="bg-[#ff00001a] p-3 rounded-lg shadow-sm border border-[#ff0000d8] mt-4 sm:mt-0">
            <div className="flex items-center">
              <FaReceipt className="text-[#ff0000d8] text-xl mr-2" />
              <span className="font-medium text-[#ff0000d8]">{payments.length} transactions</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <FiXCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
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
              <div key={payment._id} className="bg-white p-6 rounded-xl shadow-sm border border-[#ff000010] hover:border-[#ff0000d8] transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      Order #{payments.indexOf(payment) + 1} <span className="ml-2">{getStatusBadge(payment.status)}</span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">${Number(payment.foodPrice).toFixed(2)}</p>
                      {getPaymentGatewayIcon(payment.transactionId, payment.title)}
                    </div>
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete payment"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {payment.items?.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">{item.foodName}</h4>
                            <p className="text-xs text-gray-500">From: {item.restaurantName}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <button
                            onClick={() => openReviewModal(item)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full shadow-sm text-white bg-[#ff0000d8] hover:bg-[#e60000] transition-all"
                          >
                            <FaStar className="mr-1" /> Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <dialog id="review_modal" className="modal">
          <div className="modal-box w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#ff0000d8]">Leave a Review</h3>
                <p className="text-sm text-gray-500">Your feedback helps others</p>
              </div>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>

            <div className="mb-4 p-3 bg-gray-100 rounded">
              <h4 className="text-sm font-semibold">{selectedFood?.foodName}</h4>
              <p className="text-xs text-gray-600">From: {selectedFood?.restaurantName}</p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Your Rating</label>
              <div className="flex items-center">
                <Rating value={rating} onChange={setRating} ratedColor="#ff0000d8" />
                <span className="ml-2 text-sm text-[#ff0000d8] font-semibold">{rating} star{rating > 1 && 's'}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Your Review</label>
              <textarea
                className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm focus:ring-[#ff0000d8] focus:border-[#ff0000d8]"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write about your experience..."
              />
            </div>

            <div>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className={`w-full py-2 px-4 rounded-md text-white text-sm font-semibold bg-[#ff0000d8] hover:bg-[#e60000] transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default PaymentHistory;