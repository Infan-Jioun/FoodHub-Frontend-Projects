import React, { useState, useEffect } from 'react';
import { Typography, Button, CircularProgress, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import emailjs from '@emailjs/browser';

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

    // EmailJS init
    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }, []);

    // After redirect from SSLCommerz
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("status") === "success") {
            toast.success("Payment successful! Sending confirmation email...");

            const paymentData = {
                to_email: user?.email || authUser?.email,
                to_name: formData.customerName,
                payment_id: "TXN" + Date.now(),
                total_amount: total.toFixed(2),
                address: formData.address,
                upazila: formData.upazila,
                district: formData.district,
                division: formData.division,
                country: formData.country,
                contact_number: formData.contactNumber,
                items_html: cartFood.map(item => `
                    <tr>
                        <td>${item.foodName}</td>
                        <td>${item.restaurantName}</td>
                        <td>${item.quantity}</td>
                        <td>$${(item.foodPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join(''),
            };

            emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                paymentData
            ).then((response) => {
                console.log("Email sent successfully:", response);
                toast.success("Confirmation email sent!");
            }).catch((err) => {
                console.error("Failed to send email:", err);
                toast.error("Failed to send confirmation email.");
            });
        }
    }, []);

    if (isRedirecting) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6" color="primary">
                    Redirecting to SSLCommerz...
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    Please complete your payment. A confirmation email will be sent automatically.
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
                You'll be redirected to SSLCommerz secure payment page. Confirmation email will be sent after success.
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
