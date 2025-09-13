import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { imageUpload } from "../../Hooks/imageHooks";
import toast from "react-hot-toast";
import { MdCloudUpload, MdCancel } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AddFoods = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [imageError, setImageError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      restaurantName: user?.displayName || "Default Restaurant",
    },
  });

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("Please select an image");
        return;
      }

      if (!file.type.match("image.*")) {
        reject("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        reject("Image size must be less than 5MB");
        return;
      }

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
    setIsSubmitting(true);

    try {
      const foodImage = data.foodImage?.[0];
      if (!foodImage) {
        throw new Error("Please select a food image");
      }

      await validateImage(foodImage);
      const imageData = await imageUpload(foodImage);

      const foodInfo = {
        foodName: data.foodName,
        foodImage: imageData?.data?.display_url || "",
        category: data.category,
        price: parseFloat(data.price),
      };

      const res = await axiosSecure.patch(
        `/restaurantUpload/${encodeURIComponent(data.restaurantName)}`,
        foodInfo
      );

      if (res.data.success) {
        toast.success("Food item added successfully!");
        reset();
        removeImage();
        navigate(`/restaurantUpload/${data.restaurantName}`);
      } else {
        throw new Error(res.data.message || "Failed to add food item");
      }
    } catch (error) {
      console.error(error);
      setImageError(error.message);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateImage(file)
        .then(() => {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setImageError("");
        })
        .catch((error) => {
          setImageError(error);
          setImagePreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageError("");
    setValue("foodImage", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Food Item</h2>
          <p className="text-gray-600">Fill in the details to add to your restaurant menu</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Food Image *
              </label>
              <div className="flex justify-center">
                <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    {...register("foodImage", { required: true })}
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition"
                      >
                        <MdCancel className="text-[#ff1818] text-lg" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                      <MdCloudUpload className="text-3xl mb-2" />
                      <span className="text-sm">Upload Image</span>
                      <span className="text-xs mt-1">(500x500px max)</span>
                    </div>
                  )}
                </div>
              </div>
              {errors.foodImage && !imagePreview && (
                <p className="mt-2 text-sm text-[#ff1818]">Please upload a food image</p>
              )}
              {imageError && (
                <p className="mt-2 text-sm text-[#ff1818]">{imageError}</p>
              )}
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                {...register("restaurantName", { required: true })}
                readOnly
              />
            </div>

            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                placeholder="e.g., Margherita Pizza"
                {...register("foodName", {
                  required: "Food name is required",
                  minLength: {
                    value: 2,
                    message: "Must be at least 2 characters"
                  }
                })}
              />
              {errors.foodName && (
                <p className="mt-1 text-sm text-[#ff1818]">{errors.foodName.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full pl-8 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                  placeholder="0.00"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0.01,
                      message: "Price must be greater than 0"
                    }
                  })}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-[#ff1818]">{errors.price.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                {...register("category", {
                  required: "Please select a category"
                })}
              >
                <option value="">Select a category</option>
                <option value="Biryani">Biryani</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Cake">Cake</option>
                <option value="Juice">Juice</option>
                <option value="Chinese">Chinese</option>
                <option value="Coffee">Coffee</option>
                <option value="Chicken">Chicken</option>
                <option value="Beef">Beef</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-[#ff1818]">{errors.category.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Food Item"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFoods;