import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Rating,
  Button,
} from '@material-tailwind/react';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';

const RestaurantReviewModal = ({ open, onClose, payment }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const restaurantName = payment?.items?.[0]?.restaurantName;

  useEffect(() => {
    if (!restaurantName || !user?.email) return;

    const checkIfReviewed = async () => {
      try {
        const res = await axiosSecure.get(
          `/restaurant-review/check?restaurant=${encodeURIComponent(
            restaurantName
          )}&email=${encodeURIComponent(user.email)}`
        );
        setAlreadyReviewed(res.data?.reviewed);
      } catch (err) {
        console.error(err);
      }
    };

    checkIfReviewed();
  }, [restaurantName, user?.email, axiosSecure]);

  const handleSubmit = async () => {
    if (!rating || !comment) {
      return toast.error('Please provide both rating and comment.');
    }

    try {
      const res = await axiosSecure.patch(`/restaurant-review/${restaurantName}`, {
        email: user.email,
        name: user.displayName,
        rating,
        comment,
        date: new Date(),
      });

      if (res.data.success) {
        toast.success('Restaurant reviewed successfully!');
        setAlreadyReviewed(true);
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to review.');
      }
    } catch (error) {
      toast.error('Error submitting review.');
    }
  };

  return (
    <Dialog 
    open={open} 
    handler={onClose} 
    size="sm"
    className="rounded-lg"
  >
    <DialogHeader className="flex flex-col items-center border-b border-gray-200 pb-4">
      <div className="text-xl font-bold text-[#ff1818]">Rate Your Experience</div>
      <div className="text-xs text-gray-500 mt-1">How was your visit to this restaurant?</div>
    </DialogHeader>
    
    <DialogBody className="space-y-5 px-6 py-4">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">{restaurantName}</p>
        <div className="flex items-center justify-center mt-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-[#ff1818] mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-xs text-gray-500">Restaurant</span>
        </div>
      </div>
  
      <div className="flex flex-col items-center">
        <Rating
          value={rating}
          onChange={(val) => setRating(val)}
          readonly={alreadyReviewed}
          ratedColor="#ff1818"
          className="flex gap-1 text-2xl"
        />
        {rating > 0 && (
          <span className="text-sm text-gray-600 mt-2">
            {rating} star{rating > 1 ? 's' : ''}
          </span>
        )}
      </div>
  
      <textarea
        className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#ff1818] focus:border-transparent ${
          alreadyReviewed 
            ? "bg-gray-100 border-gray-200 text-gray-500" 
            : "bg-white border-gray-300 text-gray-700"
        }`}
        rows="4"
        placeholder={
          alreadyReviewed 
            ? "Thank you for your review!" 
            : "Share details about your experience..."
        }
        disabled={alreadyReviewed}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
  
      {alreadyReviewed && (
        <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-green-600 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-sm font-medium text-green-600">
            You've already reviewed this restaurant
          </span>
        </div>
      )}
    </DialogBody>
  
    <DialogFooter className="border-t border-gray-200 px-6 py-3">
      <Button 
        variant="text" 
        onClick={onClose}
        className="text-gray-600 hover:bg-gray-100 mr-2"
      >
        Close
      </Button>
      {!alreadyReviewed && (
        <Button 
          onClick={handleSubmit}
          className={`bg-[#ff1818] hover:bg-[#e60000] text-white shadow-md ${
            rating === 0 ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={rating === 0}
        >
          Submit Review
        </Button>
      )}
    </DialogFooter>
  </Dialog>
  );
};

export default RestaurantReviewModal;
