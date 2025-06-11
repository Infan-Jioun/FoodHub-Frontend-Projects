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

const CheckoutForm = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [cartFood, refetch, handleRemove] = useAddFood();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const {restaurantName} = cartFood;

    const stripeKey = import.meta.env.VITE_STRIPE_PAYMENT || "";
    const stripePromise = loadStripe(stripeKey);
    const [loadingGeo, setLoadingGeo] = useState({
        division: false,
        district: false,
        upazila: false
    });

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
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

    const isAddressComplete = () => {
        if (watch("country") !== "Bangladesh") {
            return watch("address") && watch("country");
        }
        return (
            watch("address") &&
            watch("country") &&
            watch("division") &&
            watch("district") &&
            watch("upazila")
        );
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

    const watchCountry = watch("country");
    const watchDivision = watch("division");
    const watchDistrict = watch("district");

    useEffect(() => {
        if (watchCountry === "Bangladesh") {
            setLoadingGeo(prev => ({ ...prev, division: true }));
            setTimeout(() => {
                const opts = bangladeshGeoData.map(div => ({
                    value: div.division,
                    label: div.division
                }));
                setDivisions(opts);
                setLoadingGeo(prev => ({ ...prev, division: false }));
            }, 400);
        } else {
            setDivisions([]); setDistricts([]); setUpazilas([]);
            setValue("division", ""); setValue("district", ""); setValue("upazila", "");
        }
    }, [watchCountry, setValue]);

    useEffect(() => {
        if (watchDivision) {
            setLoadingGeo(prev => ({ ...prev, district: true }));
            setTimeout(() => {
                const divObj = bangladeshGeoData.find(d => d.division === watchDivision);
                if (divObj) {
                    const opts = divObj.districts.map(dist => ({
                        value: dist.district,
                        label: dist.district
                    }));
                    setDistricts(opts);
                }
                setLoadingGeo(prev => ({ ...prev, district: false }));
            }, 400);
        } else {
            setDistricts([]); setUpazilas([]);
            setValue("district", ""); setValue("upazila", "");
        }
    }, [watchDivision, setValue]);

    useEffect(() => {
        if (watchDistrict) {
            setLoadingGeo(prev => ({ ...prev, upazila: true }));
            setTimeout(() => {
                const divObj = bangladeshGeoData.find(d => d.division === watchDivision);
                const distObj = divObj?.districts.find(di => di.district === watchDistrict);
                if (distObj) {
                    const opts = distObj.upazilas.map(u => ({
                        value: u,
                        label: u
                    }));
                    setUpazilas(opts);
                }
                setLoadingGeo(prev => ({ ...prev, upazila: false }));
            }, 400);
        } else {
            setUpazilas([]);
            setValue("upazila", "");
        }
    }, [watchDistrict, watchDivision, setValue]);

    const subtotal = cartFood.reduce((acc, item) => acc + item.foodPrice * (item.quantity || 1), 0);
    const discount = subtotal * 0.15;
    const total = subtotal - discount;

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
                className={`text-[#ff1818] ${error ? 'border-red-500 rounded-md' : ''}`}
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
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );

    return (
        <div className="min-h-screen  mx-auto  bg-white">
            <Helmet><title>Checkout | Food Delivery</title></Helmet>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto py-8 px-4 bg-red-50">
                <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 drop-shadow-2xl ">

                    {/* Left side - Customer Info */}
                    <motion.div className="bg-white p-6 rounded-lg shadow-md" initial={{ x: -50 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 100 }}>
                        <h2 className="text-2xl font-bold text-[#ff1818] mb-6">Customer Information</h2>
                        <div className="space-y-4 ">
                            <div>
                                <Input
                                    label="Full Name"
                                    color="red"
                                    {...register("customerName", {
                                        required: "Full name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Name should be at least 3 characters"
                                        }
                                    })}
                                    error={!!errors.customerName}
                                />
                                {errors.customerName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                                )}
                            </div>

                            <Input label="Email" type="email" color="red" defaultValue={user?.email} readOnly />

                            <div>
                                <Input
                                    label="Phone Number"
                                    color="red"
                                    {...register("contactNumber", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^(?:\+88|01)?\d{11}$/,
                                            message: "Please enter a valid Bangladeshi phone number"
                                        }
                                    })}
                                    error={!!errors.contactNumber}
                                />
                                {errors.contactNumber && (
                                    <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <CustomSelect
                                    options={[{ value: "Bangladesh", label: "Bangladesh" }, { value: "Other", label: "Other Country" }]}
                                    placeholder="Select Country"
                                    isLoading={false}
                                    value={watchCountry || ""}
                                    onChange={val => {
                                        setValue("country", val, { shouldValidate: true });
                                        setValue("division", "");
                                        setValue("district", "");
                                        setValue("upazila", "");
                                    }}
                                    error={errors.country}
                                    name="country"
                                />
                            </div>

                            <AnimatePresence>
                                {watchCountry === "Bangladesh" && (
                                    <motion.div className="space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                                            <CustomSelect
                                                options={divisions}
                                                placeholder="Select Division"
                                                isLoading={loadingGeo.division}
                                                value={watchDivision || ""}
                                                onChange={val => {
                                                    setValue("division", val, { shouldValidate: true });
                                                    setValue("district", "");
                                                    setValue("upazila", "");
                                                }}
                                                error={errors.division}
                                                name="division"
                                            />
                                        </div>

                                        {watchDivision && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                                <CustomSelect
                                                    options={districts}
                                                    placeholder="Select District"
                                                    isLoading={loadingGeo.district}
                                                    value={watchDistrict || ""}
                                                    onChange={val => {
                                                        setValue("district", val, { shouldValidate: true });
                                                        setValue("upazila", "");
                                                    }}
                                                    error={errors.district}
                                                    name="district"
                                                />
                                            </motion.div>
                                        )}

                                        {watchDistrict && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Upazila</label>
                                                <CustomSelect
                                                    options={upazilas}
                                                    placeholder="Select Upazila"
                                                    isLoading={loadingGeo.upazila}
                                                    value={watch("upazila") || ""}
                                                    onChange={val => setValue("upazila", val, { shouldValidate: true })}
                                                    error={errors.upazila}
                                                    name="upazila"
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <Textarea
                                    label="Full Address"
                                    color="red"
                                    {...register("address", {
                                        required: "Address is required",
                                        minLength: {
                                            value: 10,
                                            message: "Address should be at least 10 characters"
                                        }
                                    })}
                                    error={!!errors.address}
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side - Order Summary */}
                    <motion.div className="drop-shadow-2xl p-6 rounded-lg shadow-md" initial={{ x: 50 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 100 }}>
                        <h2 className="text-2xl font-bold text-[#ff1818] mb-6">Order Summary</h2>

                        {cartFood.length === 0 ? (
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
                                <p className="text-lg text-gray-600">Your cart is empty</p>
                                <Button color="red" className="mt-4" onClick={() => navigate('/restaurants')}>Browse Menu</Button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="divide-y drop-shadow-2xl divide-gray-200">
                                    {cartFood.map(item => (
                                        <motion.div key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center py-4">
                                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                                                <img src={item.foodImage} alt={item.foodName} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm font-medium">{item.foodName}</h3>
                                                    <p className="ml-4 font-bold">${item.foodPrice.toFixed(2)}</p>
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                                                    <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemove(item._id)}>
                                                        <MdDeleteOutline size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-6 border-t border-gray-200 pt-6">
                                    <div className="flex justify-between py-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between py-2"><span>Discount (15%)</span><span>-${discount.toFixed(2)}</span></div>
                                    <div className="flex justify-between py-2 font-bold text-lg"><span>Total</span><span className="text-[#ff1818]">${total.toFixed(2)}</span></div>
                                </div>
                                <Box textAlign="center" mt={4}>
                                    <Tooltip
                                        title={!isValid ? "Please complete all required fields" : ""}
                                        placement="top"
                                    >
                                        <span>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleOpenModal}
                                                sx={{ px: 4, py: 1.5, fontSize: '16px' }}
                                                disabled={!isValid || cartFood.length === 0}
                                            >
                                                Proceed to Payment
                                            </Button>
                                        </span>
                                    </Tooltip>

                                    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                                        <DialogTitle>
                                            <Typography variant="h6" align="center">
                                                Select Payment Method
                                            </Typography>
                                        </DialogTitle>

                                        <DialogContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                                                <Button 
                                                    variant={selectedPaymentMethod === 'stripe' ? 'contained' : 'outlined'} 
                                                    onClick={() => handlePaymentMethodSelect('stripe')}
                                                >
                                                    Stripe
                                                </Button>
                                                <Button 
                                                    variant={selectedPaymentMethod === 'sslcommerz' ? 'contained' : 'outlined'} 
                                                    onClick={() => handlePaymentMethodSelect('sslcommerz')}
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

                                        <DialogActions>
                                            <Button onClick={handleCloseModal} color="error">
                                                Cancel
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </>
                        )}
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default CheckoutForm;