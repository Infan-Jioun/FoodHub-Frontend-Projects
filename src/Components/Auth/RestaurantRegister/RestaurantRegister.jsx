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
  import { useState } from "react";
  import { Eye, EyeOff } from "lucide-react";
  
  const RestaurantRegister = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const from = location.state?.from?.pathname || "/";
    const axiosSecure = useAxiosSecure();
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
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
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 w-full bg-white rounded-2xl shadow-2xl overflow-hidden mt-10">
          
          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center bg-gray-100">
            <img
              src="https://i.ibb.co.com/nBHCFg8/seller-Mode.png"
              alt="Seller Mode"
              className="object-cover w-full h-full rounded-l-2xl"
            />
          </div>
  
          {/* Form Section */}
          <div className="p-6 sm:p-10 w-full max-w-2xl mx-auto">
            <Card color="transparent" shadow={false}>
              <Typography variant="h4" color="red" className="text-center font-bold uppercase mb-6">
                Restaurant Sign Up
              </Typography>
  
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <Input
                    size="lg"
                    label="Restaurant Name"
                    {...register("displayName", { required: true })}
                  />
                  {errors.displayName && (
                    <span className="text-red-500 text-sm">This field is required</span>
                  )}
                </div>
  
                {/* Email */}
                <div>
                  <Input
                    size="lg"
                    type="email"
                    label="Restaurant Email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">This field is required</span>
                  )}
                </div>
  
                {/* Address */}
                <div>
                  <Input
                    size="lg"
                    label="Restaurant Address"
                    {...register("restaurantAddress", { required: true })}
                  />
                  {errors.restaurantAddress && (
                    <span className="text-red-500 text-sm">This field is required</span>
                  )}
                </div>
  
                {/* Phone */}
                <div>
                  <Input
                    size="lg"
                    type="number"
                    label="Phone Number"
                    {...register("phoneNumber", { required: true })}
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-sm">This field is required</span>
                  )}
                </div>
  
                {/* Password */}
                <div className="relative">
              <Input
                type={showPassword ? "text" : "password"} 
                label="Password"
                color="red"
                className="w-full rounded-lg  border-[#ff1818] pr-10"
                placeholder="••••••••"
                {...register("password", { 
                  required: true, 
                  minLength: 6, 
                  maxLength: 8 
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#ff1818] hover:text-[#ff1818]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#ff1818] hover:text-[#ff1818]" />
                )}
              </button>
            </div>
  
                {/* File Upload (optional section) */}
                {/* <div>
                  <label className="block text-sm font-bold text-red-500">Logo (300×300)</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("photo", { required: true })}
                    className="file-input file-input-ghost w-full"
                  />
                  {errors.photo && <span className="text-red-500 text-sm">Logo is required</span>}
                </div>
  
                <div>
                  <label className="block text-sm font-bold text-red-500">Banner (1080×1080)</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("banner", { required: true })}
                    className="file-input file-input-ghost w-full"
                  />
                  {errors.banner && <span className="text-red-500 text-sm">Banner is required</span>}
                </div> */}
  
                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#ff1818] text-white py-3 rounded-lg font-semibold uppercase hover:bg-[#e41616] transition"
                >
                  Submit Request
                </button>
              </form>
  
              <Typography color="gray" className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-[#ff1818] font-semibold hover:underline">
                  Sign In
                </a>
              </Typography>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  export default RestaurantRegister;
  