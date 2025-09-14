import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { imageUpload } from '../../Hooks/imageHooks';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const UploadInfo = () => {
    const { updateUserProfile, user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alreadyUploaded, setAlreadyUploaded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email && user?.displayName) {
            axiosSecure.get(`/restaurantUpload?email=${user.email}&restaurantName=${user.displayName}`)
                .then(res => {
                    if (res.data?.exists) {
                        toast.error("You already uploaded your restaurant.");
                        navigate("/restaurants");
                    } else {
                        setLoading(false);
                    }
                })
                .catch(() => {
                    toast.error("Failed to check restaurant existence.");
                    setLoading(false);
                });
        }
    }, [user, axiosSecure, navigate]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            restaurantName: user?.displayName || "Default Restaurant",
            email: user?.email || "default@email.com",
        },
    });

    const onSubmit = async (data) => {
        const logo = data.photo?.[0];
        const banner = data.banner?.[0];

        if (!logo || !banner) {
            toast.error("Please upload both logo and banner images.");
            return;
        }

        try {
            setIsSubmitting(true);

            const validateImage = (file, maxWidth, maxHeight) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            if (img.width > maxWidth || img.height > maxHeight) {
                                reject(`Image must be within ${maxWidth}x${maxHeight}px.`);
                            } else {
                                resolve();
                            }
                        };
                        img.onerror = () => reject("Invalid image.");
                        img.src = e.target.result;
                    };
                    reader.onerror = () => reject("File read error.");
                    reader.readAsDataURL(file);
                });

            await validateImage(logo, 300, 300);
            await validateImage(banner, 400, 250);

            const logoData = await imageUpload(logo);
            const bannerData = await imageUpload(banner);

            await updateUserProfile(data.restaurantName, logoData?.data?.display_url || "");

            const usersInfo = {
                restaurantName: data.restaurantName,
                email: data.email,
                restaurantAddress: data.restaurantAddress,
                restaurantNumber: parseFloat(data.restaurantNumber),
                resataurantCategory: data.restaurantCategory,
                photo: logoData?.data?.display_url || "",
                banner: bannerData?.data?.display_url || "",
                districtName: data.districtName,
            };

            await toast.promise(
                axiosSecure.post("/restaurantUpload", usersInfo),
                {
                    loading: 'Submitting...',
                    success: 'Restaurant added successfully!',
                    error: (err) => {
                        if (err.response?.status === 409) {
                            return "This restaurant is already uploaded.";
                        }
                        return "Submission failed.";
                    }
                }
            );
            navigate("/restaurants");
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-10 text-[#ff1818] font-semibold">Checking restaurant status...</p>;
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-red-50 px-4 py-12">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 md:p-10">
                <h2 className="text-3xl font-bold text-center text-[#ff1818] mb-8 font-Caveat">Upload Restaurant Info</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-[#ff1818]">Restaurant Name</label>
                            <input
                                type="text"
                                readOnly
                                {...register("restaurantName", { required: true })}
                                className="w-full px-4 py-2 border rounded-lg bg-white text-[#ff1818] focus:outline-none"
                            />
                            {errors.restaurantName && <p className="text-xs text-[#ff1818] mt-1">Required field</p>}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-[#ff1818]">Email</label>
                            <input
                                type="email"
                                readOnly
                                {...register("email", { required: true })}
                                className="w-full px-4 py-2 border rounded-lg text-[#ff1818] bg-white focus:outline-none"
                            />
                            {errors.email && <p className="text-xs text-[#ff1818] mt-1">Required field</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-[#ff1818]">Restaurant Address</label>
                        <input
                            type="text"
                            {...register("restaurantAddress", { required: true })}
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none text-[#ff1818]"
                        />
                        {errors.restaurantAddress && <p className="text-xs text-[#ff1818] mt-1">Required field</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-[#ff1818]">Phone Number</label>
                        <input
                            type="number"
                            {...register("restaurantNumber", { required: true })}
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none text-[#ff1818]"
                        />
                        {errors.restaurantNumber && <p className="text-xs text-[#ff1818] mt-1">Required field</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-[#ff1818]">Category</label>
                        <select
                            {...register("restaurantCategory", { required: true })}
                            defaultValue=""
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none text-[#ff1818]"
                        >
                            <option value="" disabled>Choose a category</option>
                            <option>Biryani</option>
                            <option>Pizza</option>
                            <option>Burger</option>
                            <option>Cake</option>
                            <option>Chicken</option>
                            <option>Juice</option>
                            <option>Coffee</option>
                            <option>Beef</option>
                            <option>Chinese</option>
                        </select>
                        {errors.restaurantCategory && <p className="text-xs text-[#ff1818] mt-1">Required field</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-[#ff1818]">District</label>
                        <select
                            {...register("districtName", { required: "District is required" })}
                            defaultValue=""
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none text-[#ff1818]"
                        >
                            <option value="" disabled>Select a district</option>
                            {[
                                "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj",
                                "Munshiganj", "Mymensingh", "Narsingdi", "Narayanganj", "Tangail", "Shariatpur", "Netrokona",
                                "Chittagong", "Bandarban", "Brahmanbaria", "Chandpur", "Feni", "Khagrachari", "Lakshmipur",
                                "Noakhali", "Rangamati", "Cox'sbazar", "Khulna", "Bagerhat", "Chuadanga", "Jessore", "Jhenaidah",
                                "Kushtia", "Meherpur", "Mongla", "Satkhira", "Barishal", "Barguna", "Bhola", "Jhalokathi",
                                "Patuakhali", "Pirojpur", "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj", "Rangpur", "Dinajpur",
                                "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon", "Rajshahi",
                                "Bogra", "Chapai Nawabganj", "Naogaon", "Natore", "Pabna", "Shibganj"
                            ].map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                        {errors.districtName && <p className="text-xs text-[#ff1818] mt-1">{errors.districtName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-[#ff1818]">Logo (300x300)</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("photo", { required: true })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                            />
                            {errors.photo && <p className="text-xs text-[#ff1818] mt-1">Logo is required</p>}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-[#ff1818]">Banner (400x250)</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("banner", { required: true })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                            />
                            {errors.banner && <p className="text-xs text-[#ff1818] mt-1">Banner is required</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full mt-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
                            isSubmitting ? "bg-red-400 cursor-not-allowed" : "bg-[#ff1818] hover:bg-[#ff1818]"
                        }`}
                    >
                        {isSubmitting ? "Submitting..." : "Add Restaurant"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default UploadInfo;
