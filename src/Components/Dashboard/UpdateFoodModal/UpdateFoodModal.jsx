import React, { useState, useRef } from 'react';
import { RxUpdate } from 'react-icons/rx';
import { MdCloudUpload, MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const UpdateFoodModal = ({ restaurantName, food, refetch, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(food?.foodImage || '');
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    foodName: food?.foodName || '',
    foodImage: food?.foodImage || '',
    category: food?.category || '',
    price: food?.price || '',
    description: food?.description || ''
  });

  const categories = ['Pizza', 'Biryani', 'Burger', 'Pasta', 'Salad', 'Drink'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  };

  const handleImageFile = (file) => {
    if (!file.type.match('image.*')) {
      setImageError('Please select an image file (JPEG, PNG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size must be less than 2MB');
      return;
    }

    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.foodName.trim()) throw new Error('Food name is required');
      if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        throw new Error('Please enter a valid price');
      }

      let imageUrl = formData.foodImage;
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const uploadRes = await axiosSecure.post('/upload', uploadFormData);
        imageUrl = uploadRes.data.imageUrl;
      }

      const submitData = {
        ...formData,
        foodImage: imageUrl,
        price: parseFloat(formData.price),
      };

      const response = await axiosSecure.put(
        `/restaurantManage/${restaurantName}/${food.foodName}/update`,
        submitData
      );

      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || error.message,
      });
      if (error.response?.status === 404) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Update Food Item</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-[#ff1818] transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Name *</label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-[#ff1818] transition"
                required
                disabled={loading}
              />
            </div>

            {/* Food Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
              <div className="flex flex-col items-center">
                <div 
                  className={`relative w-full h-48 rounded-xl border-2 border-dashed ${
                    isDragging ? 'border-[#ff1818] bg-red-50' : 
                    imageError ? 'border-[#ff1818]' : 
                    'border-gray-300 hover:border-red-400'
                  } transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 shadow-lg hover:bg-red-100 transition transform hover:scale-110"
                          aria-label="Remove image"
                        >
                          <MdCancel className="text-[#ff1818] text-xl" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                        <MdCloudUpload className="text-2xl text-[#ff1818]" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  )}
                </div>
                {imageError && <p className="mt-2 text-sm text-[#ff1818] text-center">{imageError}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-[#ff1818] transition"
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</div>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-[#ff1818] transition"
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-[#ff1818] transition"
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-70"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className={`px-5 py-2.5 rounded-lg text-white flex items-center ${
                  loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } transition`}
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