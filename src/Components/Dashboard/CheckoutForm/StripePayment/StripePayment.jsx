import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogBody, DialogFooter, DialogHeader,
  IconButton, Input, Typography, Rating, Textarea
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaCcStripe } from 'react-icons/fa';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAddFood from '../../../Hooks/useAddFood';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const StripePayment = ({ formData }) => {
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [cartFood] = useAddFood();
  const navigate = useNavigate();

  const subtotal = cartFood?.reduce((acc, item) => acc + (item?.foodPrice || 0) * (item?.quantity || 1), 0) || 0;
  const discount = subtotal * 0.15;
  const total = subtotal - discount;

  useEffect(() => {
    if (total > 0) {
      axiosSecure.post('/create-payment-intent', { price: total })
        .then(res => {
          if (res.data?.clientSecret) {
            setClientSecret(res.data.clientSecret);
          } else {
            setError("Payment service unavailable. Please try again later.");
          }
        })
        .catch(error => {
          console.error("Payment intent error:", error);
          setError("Failed to initialize payment. Please try again.");
        });
    }
  }, [axiosSecure, total]);

  const handleSubmitStripe = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");

    try {
      if (!stripe || !elements) throw new Error("Stripe not loaded.");
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Enter your card details.");
      if (!clientSecret) throw new Error("Payment session expired. Try again.");

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

      if (stripeError) throw stripeError;

      const payment = {
        title: "Paid via Stripe",
        email: user?.email,
        foodPrice: total,
        date: new Date(),
        transactionId: paymentIntent.id,
        status: "success",
        customerName: formData?.customerName || "Guest",
        country: formData?.country,
        division: formData?.division,
        district: formData?.district,
        upazila: formData?.upazila,
        address: formData?.address,
        contactNumber: formData?.contactNumber,
        items: cartFood?.map(item => ({
          foodId: item?._id,
          restaurantName: item?.restaurantName,
          restaurantId: item?.restaurantId,
          foodName: item?.foodName,
          quantity: item?.quantity || 1,
          price: item?.foodPrice,
        })) || [],
      };

      const res = await axiosSecure.post("/payments", payment);
      if (!res.data?.paymentResult?.insertedId) throw new Error("Payment record not created");

      setPaymentId(res.data.paymentResult.insertedId);
      toast.success("Payment successful!");

      const restaurants = cartFood?.length
        ? [...new Map(cartFood.map(item => [
            item?.restaurantId,
            { id: item?.restaurantId, name: item?.restaurantName }
          ])).values()]
        : [];

      if (restaurants.length > 0) {
        setSelectedRestaurant(restaurants[0]);
        setShowReviewDialog(true);
      } else {
        navigate("/dashboard/paymentHistory");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed. Please try again.");
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!selectedRestaurant?.id) throw new Error("Restaurant info missing");

      const reviewData = {
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        customerId: user?.uid,
        customerName: user?.displayName || formData?.customerName || "Anonymous",
        rating,
        review: reviewText,
        date: new Date(),
        paymentId
      };

      const reviewResponse = await axiosSecure.post("/reviews", reviewData);
      if (!reviewResponse.data?.insertedId) throw new Error("Failed to save review");

      const restaurantUpdateResponse = await axiosSecure.put(
        `/restaurants/${selectedRestaurant.id}/reviews`,
        {
          rating,
          comment: reviewText,
          userName: user?.displayName || "Anonymous",
          userId: user?.uid
        }
      );
      if (!restaurantUpdateResponse.data?.success) throw new Error("Failed to update restaurant reviews");

      // ✅ PATCH to each food item
      const foodReviewPromises = cartFood?.map(async (item) => {
        if (!item?.restaurantName || !item?.foodName) return;

        const foodReview = {
          rating,
          review: reviewText,
          customerId: user?.uid,
          customerName: user?.displayName || formData?.customerName || "Anonymous",
          date: new Date(),
          paymentId
        };

        return await axiosSecure.patch(
          `/restaurantUpload/${encodeURIComponent(item.restaurantName)}/${encodeURIComponent(item.foodName)}`,
          { reviewData: foodReview }
        );
      });

      await Promise.all(foodReviewPromises);

      toast.success("Thank you for your review!");
      navigate("/dashboard/paymentHistory");
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setShowReviewDialog(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => setOpen(true)} 
        className="btn btn-outline mx-auto w-full mt-5 hover:bg-white"
      >
        <img className="w-10 drop-shadow-2xl" src="https://i.ibb.co.com/FLXQZjJ1/Stripe.png" alt="Stripe" />
      </button>

      {/* Payment Dialog */}
      <Dialog size="sm" open={open} handler={() => setOpen(!open)} className="p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">Link Payment Card</Typography>
          <Typography className="mt-1 font-normal text-gray-600">Complete the form below with your card details</Typography>
          <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={() => setOpen(false)}>
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>

        <form onSubmit={handleSubmitStripe}>
          <DialogBody className="space-y-4 pb-6">
            <Button fullWidth variant="outlined" className="h-12 border-blue-500 focus:ring-blue-100/50">
              <FaCcStripe className="text-2xl text-purple-900" />
            </Button>

            <Input color="gray" label="Cardholder Name" size="lg" placeholder="e.g., John Doe" name="name" required />

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Card Details
              </Typography>
              <CardElement 
                className="border p-2 rounded-md" 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': { color: '#aab7c4' },
                    },
                    invalid: { color: '#9e2146' },
                  },
                }}
              />
            </div>

            {error && (
              <Typography color="red" className="text-sm mt-2">
                {error}
              </Typography>
            )}
          </DialogBody>

          <DialogFooter>
            <button 
              type="submit" 
              className={`ml-auto bg-[#ff1818] hover:bg-[#ff1818] p-1 w-full btn text-white ${processing ? 'opacity-70 cursor-not-allowed' : ''}`} 
              disabled={!stripe || processing}
            >
              {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} handler={() => setShowReviewDialog(false)}>
        <DialogHeader>Rate Your Experience</DialogHeader>
        <DialogBody>
          <Typography variant="h6" className="mb-4">
            How was your experience with {selectedRestaurant?.name}?
          </Typography>
          <div className="flex justify-center mb-6">
            <Rating 
              value={rating} 
              onChange={(value) => setRating(value)} 
              ratedColor="amber" 
              className="text-3xl" 
            />
          </div>
          <Textarea
            label="Your review (optional)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="mb-4"
            rows={4}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setShowReviewDialog(false);
              navigate("/dashboard/paymentHistory");
            }}
            className="mr-1"
          >
            Skip
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmitReview}
            disabled={!rating}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default StripePayment;
