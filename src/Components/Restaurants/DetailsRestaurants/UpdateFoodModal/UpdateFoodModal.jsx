import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
  Select,
  Option,
  Textarea
} from "@material-tailwind/react";
import { RxUpdate } from "react-icons/rx";
import { MdCloudUpload } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

export function UpdateFoodModal({ restaurantName, food, refetch }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(food?.foodImage || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    foodName: food?.foodName || "",
    foodImage: food?.foodImage || "",
    category: food?.category || "",
    price: food?.price || "",
    description: food?.description || ""
  });

  const axiosSecure = useAxiosSecure();

  const handleOpen = () => {
    setOpen(!open);
    // Reset form when opening
    setFormData({
      foodName: food?.foodName || "",
      foodImage: food?.foodImage || "",
      category: food?.category || "",
      price: food?.price || "",
      description: food?.description || ""
    });
    setImagePreview(food?.foodImage || "");
    setImageFile(null);
    setImageError("");
  };

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await validateImage(file);
      setImageError("");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setImageFile(file);
      setFormData(prev => ({
        ...prev,
        foodImage: URL.createObjectURL(file)
      }));
    } catch (error) {
      setImageError(error);
      setImagePreview("");
      setImageFile(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If new image was selected, upload it first
      let imageUrl = formData.foodImage;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        
        const uploadRes = await axiosSecure.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.imageUrl;
        }
      }

      const submitData = {
        ...formData,
        foodImage: imageUrl,
        price: parseFloat(formData.price)
      };

      const response = await axiosSecure.put(
        `/restaurantUpload/${restaurantName}/${food.foodName}`,
        submitData
      );

      if (response.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Food Updated!",
          text: "The food item has been updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
        refetch();
        handleOpen();
        navigate("/dashboard/restaurantManagement");
      }
    } catch (error) {
      console.error("Error updating food:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update food item"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-xl font-bold bg-[#ff0000d8] text-white rounded-full shadow-lg p-2 hover:bg-red-700"
        aria-label={`Update ${food?.foodName}`}
      >
        <RxUpdate />
      </button>

      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogHeader>Update Food Item</DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <form className="space-y-4">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Restaurant: {restaurantName}
              </Typography>
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Food Name
              </Typography>
              <Input
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                size="lg"
                label="Food Name"
                placeholder="Enter food name"
                disabled={loading}
              />
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Food Image
              </Typography>
              <div className="flex items-center justify-center">
                <div className="relative w-[200px] h-[200px] flex items-center justify-center border-4 border-dashed rounded-full cursor-pointer">
                  <input
                    type="file"
                    id="fileInput"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    name="foodImage"
                    accept="image/*"
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
              {imageError && (
                <span className="text-[#ff1818] text-sm text-center">
                  {imageError}
                </span>
              )}
              {(imagePreview || formData.foodImage) && (
                <div className="mt-4">
                  <img
                    src={imagePreview || formData.foodImage}
                    alt="Preview"
                    className="w-[150px] mx-auto h-auto rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Category
              </Typography>
              <Select
                label="Select Category"
                value={formData.category}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                disabled={loading}
              >
                <Option value="Pizza">Pizza</Option>
                <Option value="Pizza">Biryani</Option>
                <Option value="Burger">Burger</Option>
                <Option value="Pasta">Pasta</Option>
                <Option value="Salad">Salad</Option>
                <Option value="Drink">Drink</Option>
              </Select>
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Price
              </Typography>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                size="lg"
                placeholder="Enter price"
                icon={<span>Tk</span>}
                disabled={loading}
              />
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Description
              </Typography>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="lg"
                placeholder="Enter description"
                disabled={loading}
              />
            </div>
          </form>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmit}
            disabled={loading || imageError}
          >
            {loading ? "Updating..." : "Update Food"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}