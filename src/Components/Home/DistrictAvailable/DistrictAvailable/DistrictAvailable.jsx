import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DistrictAvailable = () => {
    const axiosSecure = useAxiosSecure();
    const [loadedImages, setLoadedImages] = useState({});

    const { data: districts = [] } = useQuery({
        queryKey: ["districts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/districtAvailable");
            console.log("Districts API Response:", res.data); 
            return res.data;
        }
    });

    return (
        <div className="p-6">
            <p className="text-center font-bold text-3xl font-Caveat text-[#ff1818] mt-4">
                Find us in these cities and many more!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {districts.map((district, index) => (
                    <motion.div
                        key={index}
                        className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        {/* Skeleton for loading */}
                        {!loadedImages[index] && (
                            <Skeleton
                                height={176}
                                width="100%"
                                className="absolute top-0 left-0"
                                borderRadius={12}
                            />
                        )}

                        <img
                            src={district.photo || "https://i.ibb.co.com/HL4RKtR3/cox-sbazar.jpg"}
                            alt={district.districtName || "District"}
                            className={`w-full h-44 object-cover rounded-lg transition-opacity duration-500 ${loadedImages[index] ? "opacity-100" : "opacity-0"
                                }`}
                            onLoad={() =>
                                setLoadedImages((prev) => ({ ...prev, [index]: true }))
                            }
                        />

                        <Link to={`/restaurantUpload/district/${district.districtName}`}>
                            <motion.div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white font-semibold text-lg font-Caveat hover:underline">
                                    {district.districtName || "Unknown"}
                                </p>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DistrictAvailable;
