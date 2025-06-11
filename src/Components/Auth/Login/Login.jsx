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
const Login = () => {
    const { login, googleAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/"
    const { register, handleSubmit, watch, formState: { errors }, } = useForm()
    const onSubmit = data => {
        console.log(data);
        login(data.email, data.password)
            .then(res => {
                const loginUser = res.user;
                console.log(loginUser);
                toast.success("Successfully Sginup")
            })
        navigate(from, { replace: true })
    }
    const hnadleGoogle = () => {
        googleAuth()
        .then(res => {
            const google = res.user;
            console.log(google);
            toast.success("Successfully Google")
            navigate(from, { replace: true })
        })
      

    }
    return (
        <div className="">
            <div className="hero  min-h-screen  max-w-7xl mx-auto md:px-5">
                <div data-aos="zoom-in" className=" grid md:grid-cols-2 rounded-r-2xl shadow-2xl">

                    <div className="  lg:w-full bg-white shrink-0 rounded-r-2xl shadow-2xl">
                        <div className="card-body">
                            <Card color="  transparent" className="" shadow={false}>
                                <p className="text-2xl font-extrabold mt-8 text-center mb-3 transition-all "> SIGNUP </p>



                                <form onSubmit={handleSubmit(onSubmit)} className="mt-3 mb-2 w-80 mx-auto max-w-screen-lg sm:w-80">
                                    <div className="mb-1 flex flex-col gap-6">



                                        <Input
                                            size="lg"
                                            name="email"
                                            type="email"
                                            label="Your Email"
                                            {...register("email", { required: true })}
                                        />
                                        {errors.email && <span className="text-[#ff1818] text-sm font-bold">This field is required</span>}

                                        <Input
                                            type="password"
                                            name="password"
                                            size="lg"
                                            placeholder="********"
                                            className=""
                                            label="Password"
                                            {...register("password", { required: true, minLength: 6, maxLength: 8 })}
                                        />
                                        {errors.password?.type && <span className="text-[#ff1818] ">This field is reqiure</span>}
                                        {errors.password?.type === 'minLength' && <span className="text-[#ff1818] ">This pass must 6 Characters</span>}
                                        {errors.password?.type === 'maxLength' && <span className="text-[#ff1818] ">This pass only 8 Characters</span>}
                                    </div>
                                   <Link to={"/resetPassword"}>
                                   <label className="label ml-2 font-bold">
                                        <a href="#" className="label-text-alt link link-hover text-[#ff1818]">Forgot password?</a>
                                    </label>
                                   </Link>
                                    <Checkbox 
                                      color="red" defaultChecked 
                                        label={
                                            <Typography
                                                variant="small"
                                                color=""
                                                className="flex items-center font-normal"
                                            >
                                                I agree the
                                                <a
                                                    href="#"
                                                    className="font-medium transition-colors hover:text-gray-900"
                                                >
                                                    &nbsp;Terms and Conditions
                                                </a>
                                            </Typography>

                                        }
                                        containerProps={{ className: "-ml-2.5" }}
                                    />
                                    <br />
                                    <button className=" w-full uppercase bg-[#ff1818]  hover:bg-[#ff1818f0]  text-white mt-2 btn rounded-badge" fullWidth>
                                        sign up
                                    </button>
                                    <div className="divider">OR</div>
                                </form>

                                <div className=" mx-auto "> <button onClick={hnadleGoogle} className="flex bg-white text-[14px] items-center font-bold btn rounded-full"><FcGoogle /> Continue With Google</button></div>
                                <Typography color="gray" className="mt-4 text-center font-normal">
                                    Create a new account?{" "}
                                    <a href="/register" className="font-medium text-gray-900">
                                        Sign in
                                    </a>
                                </Typography>

                            </Card>
                        </div>
                    </div>
                    <div className="text-center hidden sm:block ">
                        <img className=" md:w-[600px] md:h-[600px] lg:w-[680px] lg:h-[680px]   rounded-l-2xl" src="https://i.ibb.co.com/F6hmykd/Login.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;