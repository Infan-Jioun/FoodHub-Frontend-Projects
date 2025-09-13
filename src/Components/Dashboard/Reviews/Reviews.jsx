// Reviews.js (Restaurant Owner's View)
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaStar, FaRegStar, FaReply, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';

const Reviews = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Fetch restaurant data with reviews
    const { data: restaurantData = {}, isLoading, refetch } = useQuery({
        queryKey: ['restaurantReviews', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/restaurantManage/${user?.email}`);
            return res.data;
        }
    });

    // Extract all reviews from all foods
    const allReviews = restaurantData?.foods?.flatMap(food =>
        food.reviews?.map(review => ({
            ...review,
            foodName: food.foodName,
            foodImage: food.foodImage
        })) || []
    ) || [];

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ?
                    <FaStar key={i} className="text-yellow-400" /> :
                    <FaRegStar key={i} className="text-yellow-400" />
            );
        }
        return stars;
    };

    // Function to handle reply submission
    const handleReply = async (foodName, reviewId) => {
        try {
            const response = await axiosSecure.patch('/addReplyToReview', {
                restaurantName: restaurantData.restaurantName,
                foodName,
                reviewId,
                reply: replyText
            });

            if (response.data.success) {
                refetch();
                setReplyingTo(null);
                setReplyText('');
            }
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6 md:p-10">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-red-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Feedback</h1>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff1818] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading reviews...</p>
                    </div>
                ) : allReviews.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600">No reviews yet for your restaurant.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {allReviews.map((review, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    {review.userImage ? (
                                        <img
                                            src={review.userImage}
                                            alt="User"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <FaUser className="text-[#ff1818]" />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {review.userName || review.user || 'Anonymous'}
                                                </h3>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(review.rating)}
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {format(new Date(review.date), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                {review.foodName}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-gray-700">{review.comment}</p>

                                        {review.reply && (
                                            <div className="mt-3 pl-4 border-l-2 border-red-200">
                                                <div className="flex items-center">
                                                    <span className="font-semibold text-[#ff1818] mr-2">
                                                        Your reply:
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {format(new Date(review.replyDate), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mt-1">{review.reply}</p>
                                            </div>
                                        )}

                                        {!review.reply && (
                                            <div className="mt-3">
                                                {replyingTo === index ? (
                                                    <div className="flex flex-col space-y-2">
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            placeholder="Write your response..."
                                                            className="px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                                                            rows="2"
                                                        />
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleReply(review.foodName, review._id)}
                                                                className="bg-[#ff1818] hover:bg-[#ff1818] text-white px-3 py-2 rounded-md flex items-center"
                                                            >
                                                                <FaReply className="mr-1" />
                                                                Send Reply
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setReplyingTo(null);
                                                                    setReplyText('');
                                                                }}
                                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setReplyingTo(index)}
                                                        className="text-[#ff1818] hover:text-[#ff1818] flex items-center text-sm"
                                                    >
                                                        <FaReply className="mr-1" />
                                                        Reply to this review
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;