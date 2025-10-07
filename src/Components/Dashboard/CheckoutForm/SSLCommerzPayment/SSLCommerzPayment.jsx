import React, { useState } from 'react';
import { Typography, Button, CircularProgress, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const PaymentContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: 500,
    margin: '0 auto'
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    fontSize: '1rem'
}));

const SSLCommerzPayment = ({ onClose, total, cartFood, user, formData }) => {
    const axiosSecure = useAxiosSecure();
    const { user: authUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleSSLPayment = async () => {
        if (cartFood.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setIsProcessing(true);
        try {
            const transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);

            const paymentData = {
                title: "Online Payment via SSLCommerz",
                email: user?.email || authUser?.email,
                foodPrice: parseFloat(total.toFixed(2)),
                transactionId,
                date: new Date(),
                status: "pending",
                customerName: formData.customerName,
                country: formData.country,
                division: formData.division,
                district: formData.district,
                upazila: formData.upazila,
                address: formData.address,
                contactNumber: formData.contactNumber,
                cartIds : cartFood.map((item) => item._id),
                menuItems: cartFood.map((item) => item.foodId),
            };

            const res = await axiosSecure.post("/create-ssl-payment", paymentData);

            if (res.data.gatewayPageURL) {
                localStorage.removeItem("checkoutForm");
                setIsRedirecting(true);
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

    if (isRedirecting) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6" color="primary">
                    Redirecting to SSLCommerz...
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    Please complete your payment.
                </Typography>
            </Box>
        );
    }

    return (
        <PaymentContainer elevation={3}>
            <Typography variant="h5" gutterBottom align="center" color="primary" fontWeight="bold">
                SSLCommerz Payment
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                <Typography variant="body1" fontWeight="medium">Total Amount:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">${total.toFixed(2)}</Typography>
            </Box>

            <Typography variant="body2" color="red" sx={{ mb: 3 }}>
                You'll be redirected to SSLCommerz secure payment page.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <ActionButton
                    variant="contained"
                    fullWidth
                    onClick={handleSSLPayment}
                    disabled={isProcessing}
                    sx={{ background: 'linear-gradient(45deg, #ff1818 30%, #ff1818 90%)' }}
                >
                    {isProcessing ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Confirm Payment'}
                </ActionButton>

                <ActionButton variant="outlined" color="error" fullWidth onClick={onClose}>
                    Cancel
                </ActionButton>
            </Box>
        </PaymentContainer>
    );
};

export default SSLCommerzPayment;