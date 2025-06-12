import {
    Card,
    Input,
    Checkbox,
    Typography,
  } from "@material-tailwind/react";
  import { useForm } from "react-hook-form";
  import { Eye, EyeOff } from "lucide-react";
  import { FcGoogle } from "react-icons/fc";
  import useAuth from "../../../Hooks/useAuth";
  import toast from "react-hot-toast";
  import { useLocation, useNavigate } from "react-router-dom";
  import useAxiosSecure from "../../../Hooks/useAxiosSecure";
  import { useState } from "react";
  
  const Register = () => {
    const { createUser, googleAuth, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const from = location.state?.from?.pathname || "/";
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors } } = useForm();
  
    const onSubmit = async (data) => {
      try {
        const res = await createUser(data.email, data.password);
        if (!res || !res.user) throw new Error("User creation failed");
  
        await updateUserProfile({ displayName: data.displayName });
        await res.user.reload();
  
        const usersInfo = {
          name: data.displayName,
          email: data.email,
          date: new Date(),
          status: "Verified",
        };
  
        await toast.promise(
          axiosSecure.put("/users", usersInfo),
          {
            loading: "Saving user...",
            success: `Welcome, ${data.displayName}`,
            error: "Failed to save user.",
          }
        );
  
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("Registration failed. Try again.");
      }
    };
  
    const handleGoogle = async () => {
      try {
        const res = await googleAuth();
        if (!res || !res.user) throw new Error("Google sign-in failed");
  
        const usersInfo = {
          email: res.user.email,
          name: res.user.displayName,
          date: new Date(),
          role: "guest",
          status: "Verified",
        };
  
        await toast.promise(
          axiosSecure.put("/users", usersInfo),
          {
            loading: "Signing in...",
            success: `Signed in as ${res.user.displayName}`,
            error: "Could not save user.",
          }
        );
  
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed.");
      }
    };
  
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-6 w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Image Section */}
          <div className="hidden lg:flex items-center justify-center bg-gray-100">
            <img
              src="https://i.ibb.co/27rbkWLC/Register.png"
              alt="Register"
              className="object-cover h-full w-full"
            />
          </div>
  
          {/* Form Section */}
          <div className="w-full p-8 sm:p-10">
            <Card color="transparent" shadow={false}>
              <div className="text-center mb-6">
                <Typography variant="h4" color="red" className="uppercase font-bold">
                  Sign Up
                </Typography>
              </div>
  
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                  <Input
                    size="lg"
                    type="text"
                    label="Your Name"
                    color="red"
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
                    label="Your Email"
                    color="red"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">This field is required</span>
                  )}
                </div>
  
                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    color="red"
                    {...register("password", { required: true, minLength: 6, maxLength: 8 })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-[#ff1818]" /> : <Eye className="w-5 h-5 text-[#ff1818]" />}
                  </button>
                  {errors.password?.type === "required" && (
                    <span className="text-red-500 text-sm">This field is required</span>
                  )}
                  {errors.password?.type === "minLength" && (
                    <span className="text-red-500 text-sm">Password must be at least 6 characters</span>
                  )}
                  {errors.password?.type === "maxLength" && (
                    <span className="text-red-500 text-sm">Password must be at most 8 characters</span>
                  )}
                </div>
  
                {/* Terms */}
                <Checkbox
                  label={
                    <Typography variant="small" className="flex items-center font-normal">
                      I agree to the
                      <a href="#" className="ml-1 text-[#ff1818] font-semibold hover:underline">
                        Terms and Conditions
                      </a>
                    </Typography>
                  }
                />
  
                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#ff1818] hover:bg-[#e61616] text-white py-3 rounded-lg font-semibold transition duration-300"
                >
                  Sign Up
                </button>
              </form>
  
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t" />
                <span className="mx-4 text-gray-500">OR</span>
                <div className="flex-grow border-t" />
              </div>
  
              {/* Google Button */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>
  
              {/* Login Link */}
              <div className="mt-6 text-center">
                <Typography color="gray" className="text-sm">
                  Already have an account?{" "}
                  <a href="/login" className="text-[#ff1818] font-semibold hover:underline">
                    Sign In
                  </a>
                </Typography>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;
  