import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogBody, DialogFooter, DialogHeader,
  IconButton, Input, Typography
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaCcStripe } from 'react-icons/fa';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAddFood from '../../../Hooks/useAddFood';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import emailjs from '@emailjs/browser';

const StripePayment = ({ formData }) => {
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [cartFood] = useAddFood();
  const navigate = useNavigate();

  const subtotal = cartFood?.reduce((acc, item) => acc + (item?.foodPrice || 0) * (item?.quantity || 1), 0) || 0;
  const discount = subtotal * 0.15;
  const total = subtotal - discount;

  // Set email and cardholder name from user or formData when component mounts
  useEffect(() => {
    if (formData?.email) {
      setEmail(formData.email);
    } else if (user?.email) {
      setEmail(user.email);
    }

    if (formData?.customerName) {
      setCardholderName(formData.customerName);
    } else if (user?.displayName) {
      setCardholderName(user.displayName);
    }
  }, [user, formData]);

  // Create payment intent
  useEffect(() => {
    if (total > 0 && open) {
      axiosSecure.post('/create-payment-intent', {
        price: total,
        currency: 'usd',
        paymentMethod: 'stripe'
      })
        .then(res => {
          if (res.data?.clientSecret) {
            setClientSecret(res.data.clientSecret);
            setError("");
          } else {
            setError("Payment service unavailable. Please try again later.");
          }
        })
        .catch(err => {
          console.error("Payment intent error:", err);
          setError("Failed to initialize payment. Please try again.");
        });
    }
  }, [axiosSecure, total, open]);

  const sendEmail = async (paymentId) => {
    try {
      // Generate HTML for food items with images
      const itemsHtml = cartFood.map(item => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; display: flex; align-items: center;">
            <img src="${item.foodImage || 'https://via.placeholder.com/50'}" alt="${item.foodName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;">
            ${item.foodName}
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; display: flex; align-items: center;">
            <img src="${item.restaurantImage || 'https://via.placeholder.com/50'}" alt="${item.restaurantName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;">
            ${item.restaurantName}
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity || 1}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(item.foodPrice * (item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `).join("");

      // Validate email address
      if (!email || !isValidEmail(email)) {
        console.error("Invalid or missing email address:", email);
        toast.error("Please enter a valid email address to receive confirmation.");
        return;
      }

      const emailData = {
        to_name: formData?.customerName || user?.displayName || "Guest",
        to_email: user?.email || "infan@guest.com",
        payment_id: paymentId,
        total_amount: total.toFixed(2),
        address: formData?.address || "Not provided",
        upazila: formData?.upazila || "Not provided",
        district: formData?.district || "Not provided",
        division: formData?.division || "Not provided",
        country: formData?.country || "Not provided",
        contact_number: formData?.contactNumber || "Not provided",
        items_html: itemsHtml
      };

      // Test if EmailJS is properly configured
      if (!import.meta.env.VITE_EMAILJS_SERVICE_ID ||
        !import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
        !import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
        console.error("EmailJS environment variables are missing");
        toast.error("Email service configuration error");
        return;
      }

      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log("EmailJS result:", result);
      toast.success("Confirmation email sent!");
    } catch (err) {
      console.error("EmailJS error:", err);
      if (err.text && err.text.includes("recipients address is empty")) {
        toast.error("Email address is missing. Please enter your email address.");
      } else {
        toast.error("Failed to send confirmation email. Please check your email configuration.");
      }
    }
  };

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitStripe = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe not loaded. Please try again.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Please enter your card details.");
      setProcessing(false);
      return;
    }

    if (!clientSecret) {
      setError("Payment session expired. Please try again.");
      setProcessing(false);
      return;
    }

    // Validate email before proceeding
    if (!email || !isValidEmail(email)) {
      setError("Please enter a valid email address to receive confirmation.");
      setProcessing(false);
      return;
    }

    try {
      // First create payment method
      const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: email,
          name: cardholderName || formData?.customerName || user?.displayName || "Customer",
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message || "Invalid card details.");
      }

      // Then confirm the payment with the client secret
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        throw new Error(confirmError.message || "Payment failed. Please try again.");
      }

      if (paymentIntent.status === 'succeeded') {
        // Save payment info to backend
        const payment = {
          title: "Paid via Stripe",
          email: email,
          amount: total,
          date: new Date(),
          transactionId: paymentIntent.id,
          status: "completed",
          customerName: formData?.customerName || user?.displayName || "Guest",
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
            foodImage: item?.foodImage,
            restaurantImage: item?.restaurantImage,
            quantity: item?.quantity || 1,
            price: item?.foodPrice,
          })) || [],
        };

        const res = await axiosSecure.post("/payments", payment);

        // Check for different response structures
        if (!res.data.insertedId && !res.data.paymentResult?.insertedId) {
          console.error("Payment API response:", res.data);
          throw new Error("Payment record not created. Server response: " + JSON.stringify(res.data));
        }

        const paymentId = res.data.insertedId || res.data.paymentResult.insertedId;
        toast.success("Payment successful!");

        // Send confirmation email
        await sendEmail(paymentId);

        navigate("/dashboard/paymentHistory");
      } else {
        throw new Error("Payment not successful. Status: " + paymentIntent.status);
      }

    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
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

            <Input
              color="gray"
              label="Cardholder Name"
              size="lg"
              placeholder="e.g., John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
            />

            {/* Add email input field */}
            <Input
              color="gray"
              label="Email Address"
              type="email"
              size="lg"
              placeholder="e.g., john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

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
                      padding: '10px'
                    },
                    invalid: { color: '#9e2146' },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>

            {error && (
              <Typography color="red" className="text-sm mt-2">{error}</Typography>
            )}
          </DialogBody>

          <DialogFooter>
            <button
              type="submit"
              className={`ml-auto bg-[#ff1818] hover:bg-[#ff1818] p-1 w-full btn text-white ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={!stripe || processing || !email || !isValidEmail(email) || !cardholderName}
            >
              {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default StripePayment;