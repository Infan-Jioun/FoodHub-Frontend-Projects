import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { imageUpload } from "../../Hooks/imageHooks";
import toast from "react-hot-toast";
import { MdCloudUpload } from "react-icons/md";

const UpdateFood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const selectedFood = location.state?.food || {}; // Get selected food data

  const [imagePreview, setImagePreview] = useState(selectedFood.foodImage || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Pre-fill form fields when component loads
  useEffect(() => {
    if (selectedFood) {
      setValue("restaurantName", selectedFood.restaurantName);
      setValue("foodName", selectedFood.foodName);
      setValue("price", selectedFood.price);
      setValue("category", selectedFood.category);
    }
  }, [selectedFood, setValue]);

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit updated food data
  const onSubmit = async (data) => {
    let imageUrl = selectedFood.foodImage;

    if (data.foodImage.length > 0) {
      const imageData = await imageUpload(data.foodImage[0]);
      imageUrl = imageData?.data?.display_url || selectedFood.foodImage;
    }

    const updatedFood = {
      restaurantName: data.restaurantName,
      foodName: data.foodName,
      foodImage: imageUrl,
      category: data.category,
      price: parseFloat(data.price),
    };

    axiosSecure.patch(`/restaurantUpload/${selectedFood._id}`, updatedFood).then((res) => {
      if (res.data.modifiedCount > 0) {
        toast.success("Successfully updated food!");
        navigate("/restaurant");
      } else {
        toast.error("No changes detected or update failed.");
      }
    });
  };

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
        Update Your Food
      </h2>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            
            {/* Image Upload & Preview */}
            <div className="flex flex-col items-center">
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="relative w-[200px] h-[200px] flex items-center justify-center border-4 border-dashed border-gray-400 rounded-full">
                  <input
                    type="file"
                    id="fileInput"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    {...register("foodImage")}
                    onChange={handleImageChange}
                  />
                  <MdCloudUpload size={30} className="text-gray-600" />
                </div>
              </label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-[150px] h-[150px] rounded-full object-cover" />}
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Restaurant Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-full text-gray-800"
                {...register("restaurantName")}
                readOnly
              />
            </div>

            {/* Food Name */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Food Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-full text-gray-800"
                {...register("foodName")}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-full text-gray-800"
                {...register("price")}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Category</label>
              <select
                className="w-full px-3 py-2 border rounded-full text-gray-800"
                {...register("category")}
              >
                <option>Biryani</option>
                <option>Pizza</option>
                <option>Burger</option>
                <option>Cake</option>
                <option>Juice</option>
                <option>Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition">
                Update Food
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFood;
