import React, { useState } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import useAddFood from '../../../Hooks/useAddFood';
import useAuth from '../../../Hooks/useAuth';

const SSLCommerzPayment = ({ onClose, total, cartFood, user, formData , restaurantName }) => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSSLPayment = async () => {
        if (cartFood.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setIsProcessing(true);
        try {
            const paymentData = {
                title: "Online Payment via SSLCommerz",
                email: user?.email,
                foodPrice: parseFloat(total.toFixed(2)),
                transactionId: "",
                date: new Date(),
                
                status: "pending",
                customerName: formData.customerName,
                country: formData.country,
                division: formData.division,
                district: formData.district,
                upazila: formData.upazila,
                address: formData.address,
                contactNumber: formData.contactNumber,     
                cartFoodId: cartFood.map(item => item._id), 
                items: cartFood.map(item => ({
                    foodId: item._id,
                    restaurantName: item.restaurantName, 
                    foodName: item.foodName,
                    quantity: item.quantity || 1,
                    price: item.foodPrice,
                })),
            };

            const res = await axiosSecure.post("/create-ssl-payment", paymentData);
            if (res.data.gatewayPageURL) {
                localStorage.removeItem("checkoutForm");
                window.location.replace(res.data.gatewayPageURL);
            } else {
                toast.error("Failed to initiate SSLCommerz payment.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Payment failed!");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            <Typography variant="h6" gutterBottom>
                SSLCommerz Payment
            </Typography>
            <Typography>
                Total Amount: ${total.toFixed(2)}
            </Typography>
            <Typography sx={{ mb: 3 }}>
                You'll be redirected to SSLCommerz secure payment page.
            </Typography>

            <div className="flex gap-3">
                <Button
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#00b894', 
                        '&:hover': { backgroundColor: '#019875' },
                        flex: 1
                    }}
                    onClick={handleSSLPayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                        'Confirm Payment'
                    )}
                </Button>
                
                <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={onClose}
                    sx={{ flex: 1 }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default SSLCommerzPayment;