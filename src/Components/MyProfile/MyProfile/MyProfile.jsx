import { useState, useContext, useRef, useEffect } from "react";
import { FaCamera, FaExpand, FaPhotoVideo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: "",
    photoURL: "",
    dob: "",
    phoneNumber: "",
    address: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(() => {
    const saved = localStorage.getItem("isFormVisible");
    return saved === "false" ? false : true;
  });

  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axiosSecure
        .get(`/users/${id}`)
        .then((res) => {
          const data = res.data.profileData || res.data;
          setProfileData({
            name: data.name || "",
            photoURL: data.photo || "",
            dob: data.dob || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
          });
          setPreviewImage(data.photo || "");
        })
        .catch(() => toast.error("Failed to load user data"));
    } else if (user) {
      setProfileData({
        name: user.displayName || "",
        photoURL: user.photoURL || "",
        dob: user.dob || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
      setPreviewImage(user.photoURL || "");
    }
  }, [id, user, axiosSecure]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select a valid image file (JPEG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const imageData = await imageUpload(file);
      return { success: true, url: imageData?.data?.display_url || "" };
    } catch (error) {
      console.error("Image upload error:", error);
      return { success: false, message: "Image upload failed" };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const updateUserProfileData = async (data) => {
    try {
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photo,
      });

      const userInfo = {
        name: data.name,
        photo: data.photo,
        email: user.email,
        dob: data.dob,
        phoneNumber: data.phoneNumber,
        address: data.address,
      };

      const response = await axiosSecure.put(`/users/${user.email}`, userInfo);
      if (!response.data.success) throw new Error(response.data.message || "Failed to update database");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const { name, dob, phoneNumber, address } = profileData;
    const email = user?.email;

    if (!email) {
      toast.error("Authentication error. Please log in again.");
      setIsUpdating(false);
      return;
    }

    try {
      if (name.length < 3) throw new Error("Name must be at least 3 characters");

      let imageUrl = profileData.photoURL;
      if (selectedFile) {
        const uploadResult = await handleImageUpload(selectedFile);
        if (!uploadResult.success) throw new Error(uploadResult.message);
        imageUrl = uploadResult.url;
      }

      const result = await updateUserProfileData({ name, photo: imageUrl, dob, phoneNumber, address });

      if (result.success) {
        toast.success("Profile updated successfully!");
        setSelectedFile(null);
        setProfileData({ name, photoURL: imageUrl, dob, phoneNumber, address });
        setPreviewImage(imageUrl);
        setIsFormVisible(false);
        localStorage.setItem("isFormVisible", "false");
      } else {
        throw new Error(result.message || "Update completed with issues");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row gap-10 p-8">
        {/* Left: Profile Image */}
        <div className="flex flex-col items-center md:w-1/3 space-y-4">
          <div className="relative group w-44 h-44 rounded-full border-4 border-[#ff0000d8] overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-105">
            <img
              src={previewImage || "https://i.ibb.co/PGwHS087/profile-Imagw.jpg"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center space-y-2 rounded-full transition-opacity">
              <button
                onClick={() => {
                  setCameraMode(true);
                  handleImageClick();
                }}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 text-[#ff0000d8] px-3 py-1 rounded-full flex items-center space-x-1 text-sm"
              >
                <FaPhotoVideo />
                <span>Camera</span>
              </button>

              <button
                onClick={() => {
                  setCameraMode(false);
                  handleImageClick();
                }}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 text-[#ff0000d8] px-3 py-1 rounded-full flex items-center space-x-1 text-sm"
              >
                <FaCamera />
                <span>Upload</span>
              </button>

              {previewImage && (
                <button
                  onClick={() => setShowImageModal(true)}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100 text-[#ff0000d8] px-3 py-1 rounded-full flex items-center space-x-1 text-sm"
                >
                  <FaExpand />
                  <span>View</span>
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              capture={cameraMode ? "environment" : undefined}
              name="photo"
            />
          </div>
          <p className="text-gray-800 font-semibold text-lg">{profileData.name || "Your Name"}</p>
          <button
            onClick={() => {
              setIsFormVisible(true);
              localStorage.setItem("isFormVisible", "true");
            }}
            className="px-6 py-2 bg-[#ff0000d8] text-white rounded-md hover:bg-red-700 transition w-full max-w-xs"
          >
            Edit Profile
          </button>
        </div>

        {/* Right: Form */}
        <div className="md:w-2/3">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email (read-only)</label>
              <input
                type="email"
                name="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                required
                minLength={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff0000d8]"
              />
            </div>

            {/* Add more fields if needed */}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isUpdating}
                className={`flex-1 py-3 bg-[#ff0000d8] text-white font-semibold rounded-md shadow transition duration-300 ${
                  isUpdating ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
                }`}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormVisible(false);
                  localStorage.setItem("isFormVisible", "false");
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 transition"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            className="max-w-4xl max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default MyProfile;
