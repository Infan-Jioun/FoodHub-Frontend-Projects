import {
  Card,
  Input,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../Hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login, googleAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data.email, data.password)
      .then((res) => {
        toast.success("Successfully Logged In");
        navigate(from, { replace: true });
      })
      .catch(() => {
        toast.error("Login failed. Please check credentials.");
      });
  };

  const handleGoogle = () => {
    googleAuth()
      .then((res) => {
        toast.success("Successfully Logged in with Google");
        navigate(from, { replace: true });
      })
      .catch(() => {
        toast.error("Google authentication failed.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="grid lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden w-full max-w-6xl bg-white">
        {/* Image Section */}
        <div className="hidden lg:block bg-gray-100">
          <img
            src="https://i.ibb.co.com/F6hmykd/Login.png"
            alt="Login"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center p-8">
          <Card color="transparent" shadow={false} className="w-full max-w-sm mx-auto">
            <Typography variant="h4" className="text-center text-[#ff1818] font-extrabold font-Kanit drop-shadow-2xl mb-6">
              LOGIN
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <Input
                  size="lg"
                  type="email"
                  label="Email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-600 text-sm font-medium">Email is required</span>
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

              {/* Forgot Password */}
              <div className="">
                <Link to="/resetPassword" className="text-sm text-[#ff1818] font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Terms */}
              <Checkbox
                color="red"
           
                label={
                  <Typography variant="small" className="flex items-center text-[12px]  font-semibold">
                    I agree to the
                    <a href="#" className="font-medium text-[#ff1818] ml-1 hover:underline">
                      Terms and Conditions
                    </a>
                  </Typography>
                }
              />

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 bg-[#ff1818] text-white font-bold rounded-lg hover:bg-[#e01515] transition"
              >
                Login
              </button>

              <div className="divider text-center text-gray-500">OR</div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                className="flex items-center justify-center  gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition w-full"
              >
                <FcGoogle size={20} />
                <span className="font-medium text-sm">Continue with Google</span>
              </button>

              {/* Register */}
              <Typography color="gray" className="text-center font-normal mt-4">
                Don’t have an account?
                <Link to="/register" className="text-[#ff1818] font-medium ml-1 hover:underline">
                  Sign Up
                </Link>
              </Typography>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
