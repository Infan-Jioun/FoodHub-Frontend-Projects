import { LogInIcon, Utensils, User, ArrowRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

function Authentication() {
    const [isLoading, setIsLoading] = useState(true);
    const red = "#ff1818"; 


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 17
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        }
    };

    // Skeleton Loader Component
    const CardSkeleton = () => (
        <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 w-96 h-48 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col md:flex-row justify-center items-center gap-8 p-6">
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col md:flex-row justify-center items-center gap-8 p-6">
             <Helmet>
                <title>Authentication | FOODHUB</title>
            </Helmet>
            <motion.div
                className="flex flex-col md:flex-row justify-center items-center gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Restaurant Partner Card */}
                <motion.div
                    className="group relative bg-white p-8 rounded-2xl border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer w-full max-w-md"
                    style={{ borderColor: red }}
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg border border-red-100">
                        <motion.div
                            className="text-white p-2 rounded-full"
                            style={{ backgroundColor: red }}
                            variants={iconVariants}
                        >
                            <Utensils size={20} />
                        </motion.div>
                    </div>

                    <Link to={'/restaurantRegister'} className="block">
                        <motion.div
                            className="text-4xl mb-6 text-red-100 group-hover:text-red-200 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Utensils />
                        </motion.div>

                        <h3 className="font-bold text-2xl text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                            Become a Partner
                        </h3>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Join our network of premium restaurants and reach thousands of food lovers.
                            Grow your business with our powerful platform and marketing tools.
                        </p>

                        <motion.div
                            className="flex items-center text-red-600 font-semibold text-sm group-hover:text-red-700 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                        >
                            Get Started
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.div>
                    </Link>


                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
                </motion.div>

                {/* Customer Sign In Card */}
                <motion.div
                    className="group relative bg-white p-8 rounded-2xl border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer w-full max-w-md"
                    style={{ borderColor: red }}
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg border border-red-100">
                        <motion.div
                            className="text-white p-2 rounded-full"
                            style={{ backgroundColor: red }}
                            variants={iconVariants}
                        >
                            <User size={20} />
                        </motion.div>
                    </div>

                    <Link to={'/register'} className="block">
                        <motion.div
                            className="text-4xl mb-6 text-red-100 group-hover:text-red-200 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                        >
                            <LogInIcon />
                        </motion.div>

                        <h3 className="font-bold text-2xl text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                            Sign In Now
                        </h3>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Discover amazing restaurants and enjoy delicious food delivered to your doorstep.
                            Create an account to start your culinary journey today.
                        </p>

                        <motion.div
                            className="flex items-center text-red-600 font-semibold text-sm group-hover:text-red-700 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                        >
                            Join Now
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.div>
                    </Link>

                  
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
                </motion.div>
            </motion.div>

          
            <div className="fixed top-10 left-10 w-20 h-20 bg-red-100 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="fixed bottom-10 right-10 w-32 h-32 bg-red-200 rounded-full blur-2xl opacity-20 animate-pulse delay-1000"></div>
            <div className="fixed top-1/2 right-1/4 w-16 h-16 bg-red-100 rounded-full blur-xl opacity-40 animate-pulse delay-500"></div>
        </div>
    );
}

export default Authentication;