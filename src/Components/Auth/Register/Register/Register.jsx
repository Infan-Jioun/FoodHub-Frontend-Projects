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
            console.log("Form Data:", data);

            const res = await createUser(data.email, data.password);
            if (!res || !res.user) {
                throw new Error("User creation failed");
            }

            
            await updateUserProfile({ displayName: data.displayName });
            await res.user.reload();
            console.log("Updated User:", res.user);

            const usersInfo = {
                name: data.displayName,
                email: data.email,
                date: new Date(),
                status: "Verified",
                
            };

            await toast.promise(
                axiosSecure.put("/users", usersInfo),
                {
                    loading: "Loading...",
                    success: `Successfully registered ${data.displayName}`,
                    error: <b>Could not save user.</b>,
                }
            );

            navigate(from, { replace: true });
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("Registration failed. Please try again.");
        }
    };

    const handleGoogle = async () => {
        try {
            const res = await googleAuth();
            if (!res || !res.user) {
                throw new Error("Google sign-in failed");
            }

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
                    loading: "Loading...",
                    success: `Successfully Signed in ${res.user.displayName || "User"}`,
                    error: <b>Could not save user.</b>,
                }
            );

            navigate(from, { replace: true });
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("Google sign-in failed.");
        }
    };

    return (
        <div className="hero min-h-screen max-w-7xl mx-auto px-6 md:px-5">
            <div data-aos="zoom-in" className="grid md:grid-cols-2 rounded-r-2xl shadow-2xl">
                <div className="text-center hidden sm:block">
                    <img className="md:w-[650px] md:h-[600px] lg:w-[685px] lg:h-[670px] rounded-l-2xl"
                        src="https://i.ibb.co/27rbkWLC/Register.png" alt="Register"
                    />
                </div>
                <div className="lg:w-full bg-white shrink-0 rounded-r-2xl shadow-2xl">
                    <div className="card-body">
                        <Card color="transparent" shadow={false}>
                            <p className="text-2xl font-extrabold text-center mb-3">SIGN IN</p>
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-3 mb-2 w-80 mx-auto">
                                <div className="mb-1 flex flex-col gap-6">
                                    <Input size="lg" type="text" label="Your Name"
                                        {...register("displayName", { required: true })} />
                                    {errors.displayName && <span className="text-red-500 text-sm font-bold">This field is required</span>}

                                    <Input size="lg" type="email" label="Your Email"
                                        {...register("email", { required: true })} />
                                    {errors.email && <span className="text-red-500 text-sm font-bold">This field is required</span>}

                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"} label="Password"
                                            className="border border-gray-300 rounded-lg p-2 pr-10 w-full"
                                            placeholder="********"
                                            {...register("password", { required: true, minLength: 6, maxLength: 8 })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5 text-[#ff1818]" /> : <Eye className="w-5 h-5 text-[#ff1818]" />}
                                        </button>
                                    </div>
                                    {errors.password?.type && <span className="text-[#ff1818]">This field is required</span>}
                                    {errors.password?.type === 'minLength' && <span className="text-[#ff1818]">This pass must be at least 6 characters</span>}
                                    {errors.password?.type === 'maxLength' && <span className="text-[#ff1818]">This pass must be at most 8 characters</span>}
                                </div>

                                <Checkbox
                                    label={
                                        <Typography variant="small" color="gray" className="flex items-center font-normal">
                                            I agree to the
                                            <a href="#" className="font-medium transition-colors hover:text-gray-900">
                                                &nbsp;Terms and Conditions
                                            </a>
                                        </Typography>
                                    }
                                />

                                {/* <Typography color="gray" className="mt-4 text-center font-normal">
                                    Food Seller? <a href="/restaurantRegister" className="font-medium text-gray-900">Sign up</a>
                                </Typography> */}

                                <button type="submit" className="w-full uppercase bg-[#ff1818] text-white mt-2 btn rounded-badge">
                                    Sign In
                                </button>
                            </form>

                            <div className="divider">OR</div>

                            <button onClick={handleGoogle} className="flex text-[14px] bg-white items-center font-bold btn rounded-full">
                                <FcGoogle /> Continue With Google
                            </button>

                            <Typography color="gray" className="mt-6 text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-[#ff1818] font-semibold hover:underline">
                                Sign in
                            </a>
                        </Typography>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
