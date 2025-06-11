
  import React, { useState } from "react";
  import { useForm } from "react-hook-form";
  import useAxiosSecure from "../../Hooks/useAxiosSecure";
  import { imageUpload } from "../../Hooks/imageHooks";
  import toast from "react-hot-toast";
  import { MdCloudUpload } from "react-icons/md";
  import useAuth from "../../Hooks/useAuth";
  import { useNavigate } from "react-router-dom";
  import useRestaurantData from "../../Hooks/useRestaurantData";

  const AddFoods = () => {
    const { user } = useAuth();
    const {
      register,  handleSubmit, formState: { errors },
  setValue,
    } = useForm({
      defaultValues: {
        restaurantName: user?.displayName || "Default Restaurant",
      },
    });
  const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [imageError, setImageError] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const validateImage = (file) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onloadend = () => {
          img.onload = () => {
            if (img.width <= 500 && img.height <= 500) {
              resolve(true);
            } else {
              reject("Image dimensions must be 500x500 pixels or smaller");
            }
          };
          img.onerror = () => reject("Invalid image file");
          img.src = reader.result;
        };

        reader.readAsDataURL(file);
      });
    };

    const onSubmit = async (data) => {
      setImageError("");
      const foodImage = data.foodImage?.[0];

      try {
        await validateImage(foodImage);

        const imageData = await imageUpload(foodImage);
        const foodInfo = {
          restaurantName: data.restaurantName,
          foodName: data.foodName,
          foodImage: imageData?.data?.display_url || "",
          category: data.category,
          price: parseFloat(data.price),
         
        };

        // Send data to the backend
        axiosSecure.patch(`/restaurantUpload/${data.restaurantName}`, foodInfo)
        .then((res) => {
          console.log(res.data);
          if (res.data.modifiedCount > 0) {
            toast.success("Successfully added Food");
          } else {
            toast.error("Please Upload Your Info");
          }
        });
      } catch (error) {
        setImageError(error.message || "An error occurred");
      }
      navigate(`/restaurantUpload/${data.restaurantName}`);
    };
      
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    };

    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-[#ff1818] mb-8">Add Your Food</h2>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Food Image */}
              <div>
                <div className="flex items-center justify-center">
                  <div className="relative w-[200px] h-[200px] flex items-center justify-center border-4 border-dashed rounded-full cursor-pointer">
                    <input
                      type="file"
                      id="fileInput"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      name="foodImage"
                      accept="image/*"
                      {...register("foodImage", { required: true })}
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="fileInput"
                      className="flex items-center justify-center w-[200px] h-[200px] text-[#ff1818]"
                    >
                      <MdCloudUpload size={20} className="mr-2" />
                      Upload File
                    </label>
                  </div>
                </div>
                {errors.foodImage && (
                  <span className="text-[#ff1818] text-sm text-center">
                    This field is required
                  </span>
                )}
                {imageError && (
                  <span className="text-[#ff1818] text-sm text-center">
                    {String(imageError)}
                  </span>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-[150px] mx-auto h-auto rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Restaurant Name */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-full focus:ring-2 text-[#ff1818] focus:ring-red-400 outline-none transition"
                  placeholder="Enter restaurant name"
                  {...register("restaurantName", { required: true, minLength: 1, maxLength: 20 })}
                  readOnly
                />
                {errors.restaurantName && (
                  <span className="text-[#ff1818] text-sm">
                    This field is required
                  </span>
                )}
              </div>

              {/* Food Name */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Food Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-full focus:ring-2 text-[#ff1818] focus:ring-red-400 outline-none transition"
                  placeholder="Enter food name"
                  {...register("foodName", { required: true, minLength: 4, maxLength: 20 })}
                />
                {errors.foodName && (
                  <span className="text-[#ff1818] text-sm">
                    This field is required
                  </span>
                )}
              
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-full text-[#ff1818] focus:ring-2 focus:ring-red-400 outline-none transition"
                  placeholder="Enter price"
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <span className="text-[#ff1818] text-sm">
                    This field is required
                  </span>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-full text-[#ff1818] focus:ring-2 focus:ring-red-400 outline-none transition"
                name="category"   {...register("category", { required: true })}
                >
                  <option value="">Select Category</option>
                  <option>Biryani</option>
                  <option>Pizza</option>
                  <option>Burger</option>
                  <option>Cake</option>
                  <option>Juice</option>
                  <option>Chinese</option>
                  <option>Chicken</option>
                  <option>Beef</option>
                </select>
                {errors.category && (
                  <span className="text-[#ff1818] text-sm">
                    This field is required
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ff1818] text-white font-semibold rounded-full hover:bg-[#e60e0e] transition focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                >
                  Add Food
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddFoods;
