import { Input, Textarea, Button, Spinner } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDeleteOutline, MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Select from "react-select";
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAddFood from '../../Hooks/useAddFood';
import useAuth from '../../Hooks/useAuth';
import bangladeshGeoData from '../../../../public/District-Upzilas.json';
import { Dialog, DialogTitle, DialogContent, Box, Typography, DialogActions, Tooltip } from '@mui/material';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePayment from './StripePayment/StripePayment';
import SSLCommerzPayment from './SSLCommerzPayment/SSLCommerzPayment';
import { FaBackspace, FaBackward, FaSearch } from 'react-icons/fa';
import { Circles } from 'react-loader-spinner';
import { IoArrowBackCircleOutline } from "react-icons/io5";


const CheckoutForm = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [cartFood, refetch, handleRemove] = useAddFood();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const { restaurantName } = cartFood;

    const stripeKey = import.meta.env.VITE_STRIPE_PAYMENT || "";
    const stripePromise = loadStripe(stripeKey);
    const [loadingGeo, setLoadingGeo] = useState({
        division: false,
        district: false,
        upazila: false
    });

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [divisionLoading, setDivisionLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [openModal, setOpenModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
        trigger
    } = useForm({
        mode: "onChange",
        defaultValues: {
            customerName: '',
            contactNumber: '',
            address: '',
            country: '',
            division: '',
            district: '',
            upazila: ''
        }
    });

    const watchFields = watch();

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };



    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem("checkoutForm"));
        if (savedData) {
            Object.entries(savedData).forEach(([key, value]) => {
                setValue(key, value, { shouldValidate: true });
            });
        }
    }, [setValue]);

    useEffect(() => {
        localStorage.setItem("checkoutForm", JSON.stringify(watchFields));
    }, [watchFields]);



    const handleSearch = (e) => {
        const value = e.target.value
        setQuery(value)
        setDivisionLoading(true)
        setShowDropdown(true)

        if (value.trim() === "") {
            setResults([])
            setDivisionLoading(false)
            setShowDropdown(false)
            return
        }

        const searchValue = value.toLowerCase()
        const matches = []

        bangladeshGeoData.forEach((division) => {
            if (division.division.toLowerCase().includes(searchValue)) {
                matches.push(division.division)
            }
            division.districts.forEach((district) => {
                if (district.district.toLowerCase().includes(searchValue)) {
                    matches.push(`${district.district}, ${division.division}`)
                }
                district.upazilas.forEach((upazila) => {
                    if (upazila.toLowerCase().includes(searchValue)) {
                        matches.push(`${upazila}, ${district.district}, ${division.division}`)
                    }
                })
            })
        })

        setTimeout(() => {
            setResults(matches.slice(0, 20))
            setDivisionLoading(false)
        }, 700)
    }

    const handleSelect = (item) => {
        setQuery(item)
        setResults([])
        setShowDropdown(false)
    }

    const subtotal = cartFood.reduce((acc, item) => acc + item.foodPrice * (item.quantity || 1), 0);
    const discount = subtotal * 0.15;
    const total = subtotal - discount;
    const handleBack = () => {
        navigate(-1);
    };
    const handleOpenModal = () => {
        if (cartFood.length === 0) {
            toast.error("Your cart is empty! Please add items before checkout.");
            return;
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPaymentMethod(null);
    };

    const CustomSelect = ({ options, isLoading, placeholder, value, onChange, error, name }) => (
        <div className="relative">
            <Select
                options={options}
                placeholder={isLoading ? "Loading..." : placeholder}
                isSearchable
                isClearable
                value={options.find(o => o.value === value) || null}
                onChange={sel => {
                    onChange(sel?.value || "");
                    trigger(name);
                }}
                className={`text-[#ff1818] ${error ? 'border-[#ff1818] rounded-md' : ''}`}
                classNamePrefix="select"
                isLoading={isLoading}
                noOptionsMessage={() => "No options found"}
                loadingMessage={() => "Loading..."}
                components={{
                    DropdownIndicator: () => (
                        isLoading
                            ? <Spinner className="w-4 h-4" />
                            : <MdSearch className="text-[#ff1818] mr-2" />
                    )
                }}
            />
            {error && <p className="text-[#ff1818] text-xs mt-1">{error.message}</p>}
        </div>
    );

    return (
        <div className="min-h-screen  mx-auto  bg-white">
            <Helmet><title>Checkout | FOODHUB</title></Helmet>

            <button onClick={handleBack} className="flex items-center justify-center p-2 rounded-full border-2 border-[#ff1818]  hover:bg-[#ff1818] text-[#ff1818] hover:text-white transition-colors">
                <IoArrowBackCircleOutline size={30} />
            </button>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto py-8 px-4 bg-red-50">
                <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">

                    {/* Left side - Customer Info */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <h2 className="text-2xl font-bold text-[#ff1818] mb-6">Customer Information</h2>

                        <div className="space-y-4">
                            <div>
                                <Input
                                    label="Full Name"
                                    color="red"
                                    {...register("customerName", {
                                        required: "Full name is required",
                                        minLength: { value: 3, message: "Name should be at least 3 characters" }
                                    })}
                                    error={!!errors.customerName}
                                />
                                {errors.customerName && <p className="text-[#ff1818] text-xs mt-1">{errors.customerName.message}</p>}
                            </div>

                            <Input label="Email" type="email" color="red" defaultValue={user?.email} readOnly />

                            <div>
                                <Input
                                    label="Phone Number"
                                    color="red"
                                    {...register("contactNumber", {
                                        required: "Phone number is required",
                                        pattern: { value: /^(?:\+88|01)?\d{11}$/, message: "Enter a valid Bangladeshi phone number" }
                                    })}
                                    error={!!errors.contactNumber}
                                />
                                {errors.contactNumber && <p className="text-[#ff1818] text-xs mt-1">{errors.contactNumber.message}</p>}
                            </div>

                            {/* Location Search */}
                            <div className="relative">
                                <Input
                                    label="Search Location"
                                    color="red"
                                    {...register("location", { required: "Location is required" })}
                                    value={query}
                                    onChange={handleSearch}
                                    error={!!errors.location}
                                    placeholder="Search by division, district, upazila..."
                                />
                                {divisionLoading && (
                                    <div className="absolute right-3 top-3">
                                        <Circles height={20} width={20} color="#ff1818" ariaLabel="loading" />
                                    </div>
                                )}

                                {showDropdown && !divisionLoading && query.trim() !== "" && (
                                    <ul className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto border border-gray-200 rounded-lg shadow-lg bg-white">
                                        {results.length > 0 ? results.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="px-3 py-2 text-sm text-gray-700 hover:bg-red-100 cursor-pointer"
                                                onClick={() => handleSelect(item)}
                                            >
                                                {item}
                                            </li>
                                        )) : (
                                            <li className="px-3 py-2 text-sm text-gray-500 text-center">No location found</li>
                                        )}
                                    </ul>
                                )}

                                {errors.location && <p className="text-[#ff1818] text-xs mt-1">{errors.location.message}</p>}
                            </div>

                            <div>
                                <Textarea
                                    label="Full Address"
                                    color="red"
                                    {...register("address", {
                                        required: "Address is required",
                                        minLength: { value: 10, message: "Address should be at least 10 characters" }
                                    })}
                                    error={!!errors.address}
                                />
                                {errors.address && <p className="text-[#ff1818] text-xs mt-1">{errors.address.message}</p>}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side - Order Summary */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <h2 className="text-2xl font-bold text-[#ff1818] mb-6">Order Summary</h2>

                        {cartFood.length === 0 ? (
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
                                <p className="text-lg text-gray-600">Your cart is empty</p>
                                <Button color="red" className="mt-4">Browse Menu</Button>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {cartFood.map(item => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center justify-between p-2 border-b border-gray-200"
                                    >
                                        <div className="flex items-center">
                                            <img src={item.foodImage} alt={item.foodName} className="h-16 w-16 rounded-md object-cover" />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium">{item.foodName}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[#ff1818]">${item.foodPrice.toFixed(2)}</p>
                                    </motion.div>
                                ))}

                                <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Discount (15%)</span><span>-${discount.toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold text-lg text-[#ff1818]"><span>Total</span><span>${total.toFixed(2)}</span></div>
                                </div>

                                <Box textAlign="center" mt={4}>
                                    <Tooltip
                                        title={!isValid ? "Please complete all required fields" : ""}
                                        placement="top"
                                    >
                                        <span>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{ display: 'inline-block' }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="red"
                                                    onClick={handleOpenModal}
                                                    sx={{ px: 4, py: 1.5, fontSize: '16px' }}
                                                    disabled={!isValid || cartFood.length === 0}
                                                >
                                                    Proceed to Payment
                                                </Button>
                                            </motion.div>
                                        </span>
                                    </Tooltip>

                                    <Dialog
                                        open={openModal}
                                        onClose={handleCloseModal}
                                        className='rounded-lg'
                                        fullWidth
                                        maxWidth="sm"
                                        PaperProps={{
                                            sx: {
                                                borderRadius: 3,
                                                border: '2px solid #ff1818',
                                                boxShadow: '0 8px 20px rgba(255,24,24,0.2)',
                                                overflow: 'hidden' // animation smoother
                                            }
                                        }}
                                        TransitionComponent={motion.div}
                                        TransitionProps={{
                                            initial: { opacity: 0, y: -50 },
                                            animate: { opacity: 1, y: 0 },
                                            exit: { opacity: 0, y: 50 },
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        <DialogTitle sx={{ backgroundColor: '#ff1818', color: '#fff', textAlign: 'center', fontWeight: 'bold', py: 2 }}>
                                            Select Payment Method
                                        </DialogTitle>

                                        <DialogContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                                                <Button
                                                    variant={selectedPaymentMethod === 'stripe' ? 'contained' : 'outlined'}
                                                    onClick={() => handlePaymentMethodSelect('stripe')}
                                                    sx={{
                                                        color: selectedPaymentMethod === 'stripe' ? '#fff' : '#ff1818',
                                                        borderColor: '#ff1818',
                                                        '&.MuiButton-contained': { background: '#ff1818' },
                                                        '&:hover': { background: '#e60000', borderColor: '#e60000' }
                                                    }}
                                                >
                                                    Stripe
                                                </Button>
                                                <Button
                                                    variant={selectedPaymentMethod === 'sslcommerz' ? 'contained' : 'outlined'}
                                                    onClick={() => handlePaymentMethodSelect('sslcommerz')}
                                                    sx={{
                                                        color: selectedPaymentMethod === 'sslcommerz' ? '#fff' : '#ff1818',
                                                        borderColor: '#ff1818',
                                                        '&.MuiButton-contained': { background: '#ff1818' },
                                                        '&:hover': { background: '#e60000', borderColor: '#e60000' }
                                                    }}
                                                >
                                                    SSLCommerz
                                                </Button>
                                            </Box>

                                            {selectedPaymentMethod === 'stripe' && (
                                                <Elements stripe={stripePromise}>
                                                    <StripePayment
                                                        onClose={handleCloseModal}
                                                        total={total}
                                                        cartFood={cartFood}
                                                        user={user}
                                                        formData={watchFields}
                                                        restaurantName={restaurantName}
                                                    />
                                                </Elements>
                                            )}

                                            {selectedPaymentMethod === 'sslcommerz' && (
                                                <SSLCommerzPayment
                                                    onClose={handleCloseModal}
                                                    total={total}
                                                    cartFood={cartFood}
                                                    user={user}
                                                    formData={watchFields}
                                                    restaurantName={restaurantName}
                                                />
                                            )}
                                        </DialogContent>

                                        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                                            <Button
                                                onClick={handleCloseModal}
                                                sx={{
                                                    color: '#ff1818',
                                                    borderColor: '#ff1818',
                                                    border: '1px solid',
                                                    '&:hover': { backgroundColor: '#ffe5e5' }
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </div>
                        )}
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default CheckoutForm;