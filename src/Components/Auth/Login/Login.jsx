import { useEffect, useState } from "react";
import { Card, Input, Checkbox, Typography } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../Hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

const Login = () => {
  const { login, googleAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true); 
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); 
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    login(data.email, data.password)
      .then(() => {
        toast.success("Successfully Logged In");
        navigate(from, { replace: true });
      })
      .catch(() => {
        toast.error("Login failed. Please check credentials.");
      })
      .finally(() => setLoading(false));
  };

  const handleGoogle = () => {
    setLoading(true);
    googleAuth()
      .then(() => {
        toast.success("Successfully Logged in with Google");
        navigate(from, { replace: true });
      })
      .catch(() => {
        toast.error("Google authentication failed.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-red-50">
      <div className="grid lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden w-full max-w-6xl bg-white">
        {/* Image Section */}
        <div className="hidden lg:block bg-gray-100">
          {loading ? (
            <Skeleton height="100%" />
          ) : (
            <motion.img
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              src="https://i.ibb.co.com/F6hmykd/Login.png"
              alt="Login"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center p-8">
          <Card
            color="transparent"
            shadow={false}
            className="w-full max-w-sm mx-auto"
          >
            {/* Title */}
            {loading ? (
              <Skeleton height={40} width={120} className="mx-auto mb-6" />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  variant="h4"
                  className="text-center text-[#ff1818] font-extrabold font-Kanit drop-shadow-2xl mb-6"
                >
                  LOGIN
                </Typography>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                {loading ? (
                  <Skeleton height={45} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Input
                      size="lg"
                      type="email"
                      color="red"
                      label="Email"
                      {...register("email", { required: true })}
                    />
                  </motion.div>
                )}
                {errors.email && (
                  <span className="text-[#ff1818] text-sm font-medium">
                    Email is required
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                {loading ? (
                  <Skeleton height={45} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
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
                  </motion.div>
                )}
              </div>

              {/* Forgot Password */}
              {loading ? (
                <Skeleton width={120} height={15} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/resetPassword"
                    className="text-sm text-[#ff1818] font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </motion.div>
              )}

              {/* Terms */}
              {loading ? (
                <Skeleton height={20} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Checkbox
                    color="red"
                    label={
                      <Typography
                        variant="small"
                        className="flex items-center text-[12px] font-semibold"
                      >
                        I agree to the
                        <a
                          href="#"
                          className="font-medium text-[#ff1818] ml-1 hover:underline"
                        >
                          Terms and Conditions
                        </a>
                      </Typography>
                    }
                  />
                </motion.div>
              )}

              {/* Submit */}
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  type="submit"
                  className="w-full py-2 bg-[#ff1818] text-white font-bold rounded-lg hover:bg-[#e01515] transition"
                >
                  Login
                </motion.button>
              )}

              {/* Divider */}
              {loading ? (
                <Skeleton height={20} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="divider text-center text-gray-500"
                >
                  OR
                </motion.div>
              )}

              {/* Google */}
              {loading ? (
                <Skeleton height={40} />
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  type="button"
                  onClick={handleGoogle}
                  className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition w-full"
                >
                  <FcGoogle size={20} />
                  <span className="font-medium text-sm">
                    Continue with Google
                  </span>
                </motion.button>
              )}

              {/* Register */}
              {loading ? (
                <Skeleton height={20} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Typography
                    color="gray"
                    className="text-center font-normal mt-4"
                  >
                    Don’t have an account?
                    <Link
                      to="/register"
                      className="text-[#ff1818] font-medium ml-1 hover:underline"
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </motion.div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
