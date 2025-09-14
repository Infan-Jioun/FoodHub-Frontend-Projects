import {
  Card,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RestaurantRegister = () => {
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const from = location.state?.from?.pathname || "/";
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axiosSecure.get(
        `/users/check-name?name=${encodeURIComponent(data.displayName)}`
      );

      if (response.data?.exists) {
        toast.error("This restaurant name is already taken.");
        return;
      }

      const userResponse = await createUser(data.email, data.password);
      const registerUser = userResponse.user;

      await updateUserProfile({
        displayName: data.displayName,
      });

      const usersInfo = {
        name: data.displayName,
        email: data.email,
        restaurantAddress: data.restaurantAddress,
        restaurantNumber: parseFloat(data.phoneNumber),
        date: new Date(),
      };

      await axiosSecure.put("/users", usersInfo);

      toast.success("Successfully Registered!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="bg-red-50">
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 w-full bg-white rounded-2xl shadow-2xl overflow-hidden mt-10">
          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center bg-gray-100">
            {loading ? (
              <Skeleton height="100%" width="100%" />
            ) : (
              <motion.img
                src="https://i.ibb.co.com/nBHCFg8/seller-Mode.png"
                alt="Seller Mode"
                className="object-cover w-full h-full rounded-l-2xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-10 w-full max-w-2xl mx-auto">
            {loading ? (
              <div className="space-y-4">
                <Skeleton height={40} width="60%" />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={45} width="100%" />
              </div>
            ) : (
              <Card color="transparent" shadow={false}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h4"
                    color="red"
                    className="text-center font-bold uppercase mb-6"
                  >
                    Restaurant Sign Up
                  </Typography>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      size="lg"
                      label="Restaurant Name"
                      color="red"
                      {...register("displayName", { required: true })}
                    />
                    {errors.displayName && (
                      <span className="text-[#ff1818] text-sm">
                        This field is required
                      </span>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Input
                      size="lg"
                      type="email"
                      color="red"
                      label="Restaurant Email"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="text-[#ff1818] text-sm">
                        This field is required
                      </span>
                    )}
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Input
                      size="lg"
                      color="red"
                      label="Restaurant Address"
                      {...register("restaurantAddress", { required: true })}
                    />
                    {errors.restaurantAddress && (
                      <span className="text-[#ff1818] text-sm">
                        This field is required
                      </span>
                    )}
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Input
                      size="lg"
                      type="number"
                      color="red"
                      label="Phone Number"
                      {...register("phoneNumber", { required: true })}
                    />
                    {errors.phoneNumber && (
                      <span className="text-[#ff1818] text-sm">
                        This field is required
                      </span>
                    )}
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      color="red"
                      className="w-full rounded-lg border-[#ff1818] pr-10"
                      placeholder="••••••••"
                      {...register("password", {
                        required: true,
                        minLength: 6,
                        maxLength: 8,
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-[#ff1818]" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#ff1818]" />
                      )}
                    </button>
                    {errors.password && (
                      <span className="text-[#ff1818] text-sm">
                        Password must be 6–8 characters
                      </span>
                    )}
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button
                      type="submit"
                      className="w-full bg-[#ff1818] text-white py-3 rounded-lg font-semibold uppercase hover:bg-[#e41616] transition"
                    >
                      Submit Request
                    </button>
                  </motion.div>
                </form>

                <Typography
                  color="gray"
                  className="mt-6 text-center text-sm"
                >
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[#ff1818] font-semibold hover:underline"
                  >
                    Sign In
                  </a>
                </Typography>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegister;
