import { Helmet } from "react-helmet";
import useAuth from "../../Hooks/useAuth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [timer, setTimer] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // EmailJS setup
  const sendConfirmationEmail = async (email) => {
    try {
      await emailjs.send(
        import.meta.env.VITE_SERVICE_KEY_EMAILJS,
        import.meta.env.VITE_TEMPLATE_KEY_EMAILJS,
        { user_email: email },
        import.meta.env.VITE_API_KEY_EMAILJS
      );
    } catch (err) {
      console.error("EmailJS Error:", err);
    }
  };

  const onSubmit = async (data) => {
    const email = data.email;

    try {

      await resetPassword(email);
      toast.success("Password reset email sent! Please check your inbox.");

      await sendConfirmationEmail(email);

      reset();

      setTimer(5);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Reset Your Password</title>
      </Helmet>

      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white">Reset Your Password</h2>
            <p className="text-red-100 mt-2">
              Enter your email to receive a reset link
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-3 border bg-white text-[#ff1818] border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-[#ff1818] outline-none transition duration-200"
                  placeholder="Your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#ff1818]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={timer > 0}
                className={`w-full flex items-center justify-center py-3 px-4 ${timer > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  } text-white font-semibold rounded-lg shadow-md transition duration-200`}
              >
                {timer > 0 ? `Wait ${timer}s` : "Send Reset Link"}
                <FiArrowRight className="ml-2" />
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="font-medium text-[#ff1818] hover:text-[#ff1818]"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background blobs */}
      <div className="hidden md:block absolute top-0 left-0 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute bottom-0 left-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default ResetPassword;
