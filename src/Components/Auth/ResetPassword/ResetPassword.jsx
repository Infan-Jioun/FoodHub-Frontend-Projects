import { Helmet } from "react-helmet";
import useAuth from "../../Hooks/useAuth";
import { Input } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const emailRef = useRef();
  const {
    register,
    formState: { errors },
  } = useForm();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;

    if (!email) {
      toast.error("Please provide your email");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Password reset email sent! Please check your inbox.");

      await sendConfirmationEmail(email);

      setTimeout(() => {
        window.location.href = "https://mail.google.com/mail/u/0/?hl=en-GB#inbox";
      }, 700);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error: " + error.message);
    }
  };

  const sendConfirmationEmail = async (email) => {
    try {
      await emailjs.send(
        `${import.meta.env.VITE_SERVICEID}`,
        `${import.meta.env.VITE_TEMPLATECODE}`,
        {
          user_email: email,
        },
        `${import.meta.env.VITE_USERID}`
      );
      console.log("Notification email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error.message);
      toast.error("Failed to send confirmation email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <Helmet>
        <title>Reset Your Password</title>
      </Helmet>

      <div className="bg-white shadow-lg rounded-3xl max-w-md w-full p-8 sm:p-10">
        <h2 className="text-3xl font-extrabold font-ca text-center text-[#ff1818] mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <Input
              label="Type Your Email"
              placeholder="Type Your Email"
              inputRef={emailRef}
              color="red"
              {...register("email", { required: true })}
              className="text-[#ff1818] rounded-lg"
            />
            {errors.email && (
              <p className="text-red-600 text-sm font-semibold mt-1">
                This field is required
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#ff1818] text-white font-semibold text-lg hover:bg-[#e01414] transition duration-300 shadow-md hover:shadow-lg"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
