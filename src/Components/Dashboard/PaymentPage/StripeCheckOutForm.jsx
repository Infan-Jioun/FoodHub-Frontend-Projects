import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Textarea, Typography } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaCcStripe } from 'react-icons/fa';
import { CardElement, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import useAddFood from '../../Hooks/useAddFood';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useElements } from '@stripe/react-stripe-js';
import useAuth from '../../Hooks/useAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const StripeCheckOutForm = () => {
    const [open, setOpen] = React.useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState("")
    const stripe = useStripe();
    const axiosSecure = useAxiosSecure();
   const {user} = useAuth();
const elements = useElements();

    const [cartFood] = useAddFood();
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();
    const handleOpen = () => setOpen(!open);
    const subtotal = cartFood.reduce((acc, item) => {
        const quantity = quantities[item._id] || 1;
        return acc + item.foodPrice * quantity;
    }, 0);

    const discount = subtotal * 0.15; // 15% discount
    const total = subtotal - discount;
    const safeCartFood = Array.isArray(cartFood) ? cartFood : [];
    useEffect(() => {
        if (total > 0) {
            axiosSecure.post('/create-payment-intent', { price: total })
                .then(res => {
                    // console.log("Client Secret Received:", res.data.clientSecret);
                    if (res.data.clientSecret) {
                        setClientSecret(res.data.clientSecret);
                    } else {
                        console.error("Client Secret is null. Payment cannot be processed.");
                        setError("Payment cannot be processed. Try again.");
                    }
                })
                .catch(error => {
                    console.error("Error creating payment intent:", error);
                    setError("Payment failed. Try again.");
                });
        }
    }, [axiosSecure, total]);
    
    const handleSubmitStripe = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements) {
            setError("Stripe is not loaded.");
            return;
        }
    
        const card = elements.getElement(CardElement);
        if (!card) {
            setError("Card details not entered.");
            return;
        }
    
        if (!clientSecret) {
            setError("Payment cannot be processed. Try again.");
            return;
        }
    
        try {
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: {
                        email: user?.email || "anonymous",
                        name: user?.displayName || "anonymous",
                    },
                },
            });
    
            if (confirmError) {
                console.error("Stripe Error:", confirmError.message);
                setError(confirmError.message);
                return;
            }
    
            console.log("Payment Successful! Transaction ID:", paymentIntent.id);
    
            // Save payment details in database
            const payment = {
                title: "Paid via SSLCommerz",
                email: user?.email,
                foodPrice: parseFloat(total),
                date: new Date(),
                transactionId: paymentIntent.id,
                status: "success",
                cartFoodId: cartFood.map(item => item._id), 
            };
    
            const res = await axiosSecure.post("/payments", payment);
            if (res.data?.paymentResult?.insertedId) {
                toast.success("Payment Successful! Continue Shopping");
                navigate("/dashboard/paymentHistory");
            } else {
                toast.error("Payment data not saved in the database.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            setError("An error occurred. Please try again.");
        }
    };
    
    
    return (
        <div>
              <button onClick={handleOpen} className="btn btn-outline mx-auto w-full mt-5 hover:bg-white">
                                            <img className="w-10 drop-shadow-2xl" src="https://i.ibb.co.com/FLXQZjJ1/Stripe.png" alt="Stripe Logo" />
                                        </button>
               <Dialog  size="sm" open={open} handler={handleOpen} className="p-4">
                                            <DialogHeader className="relative m-0 block">
                                                <Typography variant="h4" color="blue-gray">
                                                    Link Payment Card
                                                </Typography>
                                                <Typography className="mt-1 font-normal text-gray-600">
                                                    Complete the form below with your card details to link your card.
                                                </Typography>
                                                
                                                <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={handleOpen}>
                                                    <XMarkIcon className="h-4 w-4 stroke-2" />
                                                </IconButton>
                                            </DialogHeader>

                                            {/* Form for Card Payment */}
                                            <form onSubmit={handleSubmitStripe}>
                                                <DialogBody className="space-y-4 pb-6">
                                                    <Button fullWidth variant="outlined" className="h-12 border-blue-500 focus:ring-blue-100/50">
                                                        <p className="text-2xl text-purple-900"><FaCcStripe /></p>
                                                    </Button>
                                                    <div>
                                                       
                                                        <Input color="gray" label='  Cardholder Name' size="lg" placeholder="e.g., John Doe" name="name" required />
                                                    </div>
                                                    <div>
                                                        <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                                                            Card Number
                                                        </Typography>
                                                        <CardElement className="border p-2 rounded-md" />
                                                    </div>
                                                    {error && <Typography color="red">{error}</Typography>}
                                                </DialogBody>

                                                <DialogFooter>
                                                    <button type="submit"  className="ml-auto bg-[#ff1818]  hover:bg-[#ff1818]  p-1 w-full  btn text-white " disabled={!stripe}>
                                                        Pay Now
                                                    </button>
                                                </DialogFooter>
                                            </form>
                                        </Dialog>
        </div>
    );
};

export default StripeCheckOutForm;