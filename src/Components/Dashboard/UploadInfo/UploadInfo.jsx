import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export default function AddRestaurantForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // your submit logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl  shadow-lg rounded-lg p-6 md:p-8
          transform transition-transform duration-500 ease-in-out
          hover:scale-105 hover:shadow-xl bg-red-50"
      >
        <h2 className="text-2xl font-bold text-center text-[#ff0000d8] mb-6 font-Caveat">
          Add Restaurant
        </h2>
    <div className="">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className=" text-[13px] mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md 
                  transition-shadow duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-red-500
                  focus:shadow-lg"
                {...register("restaurantName", { required: true })}
                readOnly
              />
              {errors.restaurantName && (
                <span className=" text-sm">
                  This field is required
                </span>
              )}
            </div>
            <div>
              <label className=" text-[13px] mb-2">
                Restaurant Email
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-md 
                  transition-shadow duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-red-500
                  focus:shadow-lg"
                {...register("email", { required: true })}
                readOnly
              />
              {errors.email && (
                <span className=" text-sm">
                  This field is required
                </span>
              )}
            </div>
          </div>

          <div>
            <label className=" text-[13px] mb-2">
              Restaurant Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md 
                transition-shadow duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-red-500
                focus:shadow-lg"
              {...register("restaurantAddress", { required: true })}
            />
            {errors.restaurantAddress && (
              <span className=" text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label className=" text-[13px] mb-2">
              Restaurant Number
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md 
                transition-shadow duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-red-500
                focus:shadow-lg"
              {...register("restaurantNumber", { required: true })}
            />
            {errors.restaurantNumber && (
              <span className=" text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
           
            <select
              className="w-full p-2 border rounded-md 
                transition-shadow duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-red-500
                focus:shadow-lg"
              {...register("restaurantCategory", { required: true })}
              defaultValue=""
            >
              <option value="" disabled>
                Choose your Restaurant Category
              </option>
              <option>Biryani</option>
              <option>Pizza</option>
              <option>Burger</option>
              <option>Cake</option>
              <option>Chicken</option>
              <option>Juice</option>
              <option>Beef</option>
              <option>Chinese</option>
            </select>
            {errors.restaurantCategory && (
              <span className=" text-sm">
                This field is required
              </span>
            )}
          </div>

          <select
            {...register("districtName", {
              required: "District selection is required",
            })}
            required
            className="w-full px-3 py-2 border  border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-red-500
              transition-shadow duration-300 ease-in-out
              focus:shadow-lg"
            defaultValue=""
          >
            <option value="" disabled>
              Select a district
            </option>
            <option value="Dhaka">Dhaka</option>
            <option value="Faridpur">Faridpur</option>
            <option value="Gazipur">Gazipur</option>
            <option value="Gopalganj">Gopalganj</option>
            <option value="Kishoreganj">Kishoreganj</option>
            <option value="Madaripur">Madaripur</option>
            <option value="Manikganj">Manikganj</option>
            <option value="Munshiganj">Munshiganj</option>
            <option value="Mymensingh">Mymensingh</option>
            <option value="Narsingdi">Narsingdi</option>
            <option value="Narayanganj">Narayanganj</option>
            <option value="Tangail">Tangail</option>
            <option value="Shariatpur">Shariatpur</option>
            <option value="Netrokona">Netrokona</option>

            <option value="Chittagong">Chittagong</option>
            <option value="Bandarban">Bandarban</option>
            <option value="Brahmanbaria">Brahmanbaria</option>
            <option value="Chandpur">Chandpur</option>
            <option value="Feni">Feni</option>
            <option value="Khagrachari">Khagrachari</option>
            <option value="Lakshmipur">Lakshmipur</option>
            <option value="Noakhali">Noakhali</option>
            <option value="Rangamati">Rangamati</option>
            <option value="Cox'sbazar">Cox'sbazar</option>

            <option value="Khulna">Khulna</option>
            <option value="Bagerhat">Bagerhat</option>
            <option value="Chuadanga">Chuadanga</option>
            <option value="Jessore">Jessore</option>
            <option value="Jhenaidah">Jhenaidah</option>
            <option value="Kushtia">Kushtia</option>
            <option value="Meherpur">Meherpur</option>
            <option value="Mongla">Mongla</option>
            <option value="Satkhira">Satkhira</option>

            <option value="Barishal">Barishal</option>
            <option value="Barguna">Barguna</option>
            <option value="Bhola">Bhola</option>
            <option value="Jhalokathi">Jhalokathi</option>
            <option value="Patuakhali">Patuakhali</option>
            <option value="Pirojpur">Pirojpur</option>

            <option value="Sylhet">Sylhet</option>
            <option value="Habiganj">Habiganj</option>
            <option value="Moulvibazar">Moulvibazar</option>
            <option value="Sunamganj">Sunamganj</option>
            <option value="Mymensingh">Mymensingh</option>

            <option value="Rangpur">Rangpur</option>
            <option value="Dinajpur">Dinajpur</option>
            <option value="Gaibandha">Gaibandha</option>
            <option value="Kurigram">Kurigram</option>
            <option value="Lalmonirhat">Lalmonirhat</option>
            <option value="Nilphamari">Nilphamari</option>
            <option value="Panchagarh">Panchagarh</option>
            <option value="Thakurgaon">Thakurgaon</option>

            <option value="Rajshahi">Rajshahi</option>
            <option value="Bogra">Bogra</option>
            <option value="Chapai Nawabganj">Chapai Nawabganj</option>
            <option value="Naogaon">Naogaon</option>
            <option value="Natore">Natore</option>
            <option value="Pabna">Pabna</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Shibganj">Shibganj</option>
          </select>
          {errors.districtName && (
            <p className=" mt-1">{errors.districtName.message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className=" text-[13px] mb-2">
                Upload Logo (300×300)
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("photo", { required: true })}
                className="w-full p-2 border rounded-md
                  transition-shadow duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-red-500
                  focus:shadow-lg"
              />
              {errors.photo && (
                <span className=" text-sm">Logo is required</span>
              )}
            </div>
            <div>
              <label className=" text-[13px] mb-2">
                Upload Banner (400×250)
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("banner", { required: true })}
                className="w-full p-2 border rounded-md
                  transition-shadow duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-red-500
                  focus:shadow-lg"
              />
              {errors.banner && (
                <span className=" text-sm">Banner is required</span>
              )}
            </div>
          </div>

          <button
            className={`w-full py-2 mt-4 text-white bg-red-600 rounded-md
              transition-colors duration-300 ease-in-out
              hover:bg-red-700 focus:ring-4 focus:ring-red-400
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Restaurant"}
          </button>
        </form>
    </div>
      </motion.div>
    </div>
  );
}
