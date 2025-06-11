import React from 'react';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useForm } from 'react-hook-form';
import { Card, Checkbox, Input, Typography } from '@material-tailwind/react';
import { imageUpload } from '../../Hooks/imageHooks';
import toast from 'react-hot-toast';

const Profile = () => {
    const { createUser, googleAuth, user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit,  formState: { errors }, } = useForm();
    const onSubmit = async data => {
        console.log(data);
        const photo = data.photo?.[0];
        const imageData= await imageUpload(photo);
     
                const ownerProfile = {
                  restaurantName : data.restaurantName,
                  restaurantEmail: data.restaurantEmail,
                  restaurantAdddress : data.restaurantAdddress,
                  restaurantNumber : parseFloat(data.restaurantNumber),
                  photo: imageData?.data?.display_url  || ""
                };
                axiosPublic.post("/ownerProfile" , ownerProfile)
                .then(res => {
                    console.log("SEND TO DATABASE",res.data);
                    if(res.data.insertedId){
                        toast.success("Successfully Created Profile")
                    }
                    navigate("/dashboard/addFoods")
                })
          
    }             
    return (
        <div className='max-w-7xl mx-auto'>
        
              <div className="card-body">
                            <Card color="  transparent" className="" shadow={false}>
                                <p className="text-2xl font-extrabold text-center mb-3 transition-all ">  Create Your Profile </p>



                                <form onSubmit={handleSubmit(onSubmit)} className="mt-3 mb-2 mx-auto w-full ">
                                    <div className="mb-1 flex flex-col gap-6">

                                        <Input size="lg"
                                            name="restaurantName"
                                            type="text"
                                            label="Restaurant Name"
                                            {...register("restaurantName", { required: true })}

                                        />
                                        {errors.restaurantName && <span className="text-red-600 text-sm font-bold">This field is required</span>}

                                        <Input
                                            size="lg"
                                            name="restaurantEmail"
                                            type="email"
                                            label="Restaurant Email"
                                            {...register("restaurantEmail", { required: true })}
                                        />
                                        {errors.restaurantEmail && <span className="text-red-600 text-sm font-bold">This field is required</span>}

                                        <Input
                                            size="lg"
                                            name="restaurantAddress"
                                            type="text"
                                            label="Restaurant Address"
                                            {...register("restaurantAdddress", { required: true })}
                                        />
                                        {errors.restaurantAdddress && <span className="text-red-600 text-sm font-bold">This field is required</span>}
                                        <Input
                                            size="lg"
                                            name="restaurantNumber"
                                            type="number"
                                            label="Restaurant Number"
                                            {...register("restaurantNumber", { required: true })}
                                        />
                                        {errors.restaurantNumber && <span className="text-red-600 text-sm font-bold">This field is required</span>}
                                      
                                        
                                    </div>
                                    <input type="file" name='photo' accept='image/*' 
                                    {...register("photo", { required: true })}
                                    
                                    className="file-input file-input-ghost w-full max-w-xs" />
                                       {errors.photo && <span className="text-red-600 text-sm font-bold">This field is required</span>}
                                    <Checkbox
                                        label={
                                            <Typography
                                                variant="small"
                                                color="gray"
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
                                    <button className=" w-full uppercase bg-[#ea9540fd] hover:bg-[#ea9540fd] text-white mt-2 btn rounded-badge" fullWidth>
                                        Submit Request
                                    </button>
                                    <br />
                                    <iframe width="500" height="500" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=400&amp;height=400&amp;hl=en&amp;q=Chittagong%20,%20Bangladesh+(FOOHUB)&amp;t=k&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps devices</a></iframe>
                                 

                                </form>

                               
                               
                            </Card>
                        </div>
        </div>
    );
};

export default Profile;