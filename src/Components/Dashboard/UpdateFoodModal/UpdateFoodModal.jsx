import React, { useState } from 'react';
import { RxUpdate } from 'react-icons/rx';
import { MdCloudUpload } from 'react-icons/md';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const UpdateFoodModal = ({ restaurantName, food, refetch, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(food?.foodImage || '');
  const [imageError, setImageError] = useState('');
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    foodName: food?.foodName || '',
    foodImage: food?.foodImage || '',
    category: food?.category || '',
    price: food?.price || '',
    description: food?.description || ''
  });

  const categories = ['Pizza', 'Biryani', 'Burger', 'Pasta', 'Salad', 'Drink'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match('image.*')) {
      setImageError('Please select an image file (JPEG, PNG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setImageError('Image size must be less than 2MB');
      return;
    }

    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Client-side validation
      if (!formData.foodName.trim()) {
        throw new Error('Food name is required');
      }

      if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        throw new Error('Please enter a valid price');
      }

      // Upload new image if changed
      let imageUrl = formData.foodImage;
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const uploadRes = await axiosSecure.post('/upload', uploadFormData);
        imageUrl = uploadRes.data.imageUrl;
      }

      // Prepare update data
      const submitData = {
        ...formData,
        foodImage: imageUrl,
        price: parseFloat(formData.price)
      };

      // Send update request
      const response = await axiosSecure.put(
        `/restaurantManage/${restaurantName}/${food.foodName}`,
        submitData
      );

      // Handle response
      if (response.data.success) {
        let alertConfig = {
          title: response.data.modifiedCount > 0 ? 'Success!' : 'No Changes',
          text: response.data.modifiedCount > 0 
            ? `${formData.foodName} updated successfully` 
            : 'No changes were made',
          icon: response.data.modifiedCount > 0 ? 'success' : 'info',
          timer: 1500,
          showConfirmButton: false
        };

        await Swal.fire(alertConfig);
        refetch();
        onClose();
      }
    } catch (error) {
      let errorTitle = 'Update Failed';
      let errorMessage = error.message;

      if (error.response) {
        switch (error.response.data?.type) {
          case 'VALIDATION_ERROR':
            errorTitle = 'Validation Error';
            errorMessage = error.response.data.message;
            break;
          case 'NOT_FOUND':
          case 'FOOD_NOT_FOUND':
            errorTitle = 'Not Found';
            errorMessage = error.response.data.message;
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }

      await Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: errorMessage,
        confirmButtonColor: '#e53e3e'
      });

      // Close modal only if restaurant/food not found
      if (error.response?.data?.type === 'NOT_FOUND' || 
          error.response?.data?.type === 'FOOD_NOT_FOUND') {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Update Food Item</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Restaurant: <span className="font-medium">{restaurantName}</span>
            </p>
          </div>

          <form className="space-y-4">
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Name *
              </label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={loading}
              />
            </div>

            {/* Food Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Image
              </label>
              <div className="flex flex-col items-center">
                <label className="relative w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-red-400 transition-colors">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <div className="flex flex-col items-center text-red-500">
                    <MdCloudUpload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Upload Image</span>
                  </div>
                </label>
                {imageError && (
                  <p className="mt-2 text-sm text-red-600 text-center">{imageError}</p>
                )}
                {(imagePreview || formData.foodImage) && (
                  <div className="mt-4">
                    <img
                      src={imagePreview || formData.foodImage}
                      alt="Food Preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} transition-colors flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <RxUpdate className="mr-2" />
                    Update Food
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateFoodModal;