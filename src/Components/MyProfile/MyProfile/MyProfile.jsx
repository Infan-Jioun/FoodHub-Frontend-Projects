import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { FaCamera, FaExpand, FaPhotoVideo, FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaEdit, FaSave, FaTimes, FaMoon, FaSun, FaUserShield, FaCheck, FaTimesCircle } from "react-icons/fa";
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiAward } from "react-icons/fi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import ProgressBar from "./ProgressBar";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";

const MyProfile = () => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: "",
    photoURL: "",
    phoneNumber: "",
    address: "",
    bio: "",
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
  const [nameAvailable, setNameAvailable] = useState(true);
  const [checkingName, setCheckingName] = useState(false);
  const [initialName, setInitialName] = useState("");

  const red = "#ff1818";
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();

  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();

  // Check if name is available
  const checkNameAvailability = useCallback(async (name) => {
    if (name.length < 3) {
      setNameAvailable(false);
      return;
    }

    // Don't check if name hasn't changed
    if (name === initialName) {
      setNameAvailable(true);
      return;
    }

    setCheckingName(true);
    try {
      const response = await axiosSecure.get(`/users/check-name?name=${encodeURIComponent(name)}`);
      setNameAvailable(!response.data.exists);
    } catch (error) {
      console.error("Error checking name:", error);
      toast.error("Error checking name availability");
      setNameAvailable(false);
    } finally {
      setCheckingName(false);
    }
  }, [axiosSecure, initialName]);

  useEffect(() => {
    if (id) {
      axiosSecure
        .get(`/users/${id}`)
        .then((res) => {
          const data = res.data.profileData || res.data;
          setProfileData({
            name: data.name || "",
            photoURL: data.photo || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            bio: data.bio || "",
          });
          setInitialName(data.name || "");
          setPreviewImage(data.photo || "");
        })
        .catch(() => toast.error("Failed to load user data"));
    } else if (user) {
      setProfileData({
        name: user.displayName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        bio: user.bio || "",
      });
      setInitialName(user.displayName || "");
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
    
    // Check name availability when name changes
    if (name === "name") {
      checkNameAvailability(value);
    }
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
        phoneNumber: data?.phoneNumber,
        address: data?.address,
        bio: data?.bio,
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

    const { name, phoneNumber, address, bio } = profileData;
    const email = user?.email;

    if (!email) {
      toast.error("Authentication error. Please log in again.");
      setIsUpdating(false);
      return;
    }

    try {
      if (name.length < 3) throw new Error("Name must be at least 3 characters");
      if (!nameAvailable) throw new Error("This username is already taken");

      let imageUrl = profileData.photoURL;
      if (selectedFile) {
        const uploadResult = await handleImageUpload(selectedFile);
        if (!uploadResult.success) throw new Error(uploadResult.message);
        imageUrl = uploadResult.url;
      }

      const result = await updateUserProfileData({
        name,
        photo: imageUrl,
        phoneNumber,
        address,
        bio,
      });

      if (result.success) {
       
        setSelectedFile(null);
        setProfileData({
          name,
          photoURL: imageUrl,
          phoneNumber,
          address,
          bio,
        });
        setInitialName(name);
        setPreviewImage(imageUrl);
        setIsFormVisible(false);
        localStorage.setItem("isFormVisible", "false");
        toast.success("Profile updated successfully!");

      } else {
        throw new Error(result.message || "Update completed with issues");
      }
    } catch (error) {
      // toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`min-h-screen bg-red-50 transition-colors duration-300 flex justify-center items-start py-12 px-4`}>
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full flex flex-col md:flex-row gap-10 p-8 transition-colors duration-300">
        {/* Left: Profile Image */}
        <div className="flex flex-col items-center md:w-1/3 space-y-6">
          <div className="relative group w-52 h-52 rounded-full border-4 border-[#ff1818] overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-105">
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
                className="bg-white bg-opacity-80 hover:bg-opacity-100 text-[#ff1818] px-3 py-1 rounded-full flex items-center space-x-1 text-sm"
              >
                <FaPhotoVideo />
                <span>Camera</span>
              </button>

              <button
                onClick={() => {
                  setCameraMode(false);
                  handleImageClick();
                }}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 text-[#ff1818] px-3 py-1 rounded-full flex items-center space-x-1 text-sm"
              >
                <FaCamera />
                <span>Upload</span>
              </button>

              {previewImage && (
                <button
                  onClick={() => setShowImageModal(true)}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100 text-[#ff1818] px-3 py-1 rounded-full flex items-center space-x-1 text-sm"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800">{profileData.name || "Your Name"}</h2>
            {profileData.bio && (
              <p className="text-gray-600 mt-2">{profileData.bio}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col w-full space-y-3 mt-auto"
          >
            <button
              onClick={() => {
                setIsFormVisible(!isFormVisible);
                localStorage.setItem("isFormVisible", !isFormVisible);
              }}
              className="px-6 py-2 bg-[#ff1818] text-white rounded-md hover:bg-[#ff1818] transition w-full flex items-center justify-center space-x-2"
            >
              <FaEdit />
              <span>{isFormVisible ? "View Profile" : "Edit Profile"}</span>
            </button>
          </motion.div>
        </div>

 
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="md:w-2/3"
            >
              <form onSubmit={handleUpdate} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="text-gray-700 font-medium mb-1 flex items-center">
                      <FiUser className="mr-2" /> Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        required
                        minLength={3}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      />
                      <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                      {profileData.name.length > 0 && (
                        <div className="absolute right-3 top-3.5">
                          {checkingName ? (
                            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : nameAvailable ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaTimesCircle className="text-[#ff1818]" />
                          )}
                        </div>
                      )}
                    </div>
                    {profileData.name.length > 0 && !checkingName && !nameAvailable && (
                      <p className="text-[#ff1818] text-sm mt-1">This username is already taken</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="text-gray-700 font-medium mb-1 flex items-center">
                      <FiMail className="mr-2" /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-4 py-3 pl-10 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
                    />
                    <FiMail className="absolute left-3 top-11 text-gray-400" />
                  </div>

                  <div className="relative">
                    <label className="text-gray-700 font-medium mb-1 flex items-center">
                      <FiPhone className="mr-2" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    />
                    <FiPhone className="absolute left-3 top-11 text-gray-400" />
                  </div>

                  <div className="relative md:col-span-2">
                    <label className="text-gray-700 font-medium mb-1 flex items-center">
                      <FiMapPin className="mr-2" /> Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    />
                    <FiMapPin className="absolute left-3 top-11 text-gray-400" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-700 font-medium mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating || !nameAvailable}
                    className={`flex-1 py-3 bg-[#ff1818] text-white font-semibold rounded-md shadow transition duration-300 ${
                      isUpdating || !nameAvailable ? "opacity-70 cursor-not-allowed" : "hover:bg-[#ff1818]"
                    } flex items-center justify-center space-x-2`}
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormVisible(false);
                      localStorage.setItem("isFormVisible", "false");
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 transition flex items-center justify-center space-x-2"
                    disabled={isUpdating}
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>


        <AnimatePresence>
          {!isFormVisible && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="md:w-2/3"
            >
              <div className="space-y-8">
                <div className="flex items-center mb-8 space-x-5">
                  <FaUserShield className="text-6xl" style={{ color: red }} />
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold drop-shadow-2xl">
                      Welcome {isAdmin ? "Admin" : isModerator ? "Moderator" : isOwner ? "Owner" : "User"}, {user?.displayName || user?.email}
                    </h2>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <span
                      className="text-xs font-semibold mt-1 inline-block"
                      style={{ color: red }}
                    >
                      Role: {isAdmin ? "Admin" : isModerator ? "Moderator" : isOwner ? "Restaurant Owner" : "User"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiUser className="mr-2" /> Personal Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-800 font-medium">{profileData.name || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{user?.email || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiMapPin className="mr-2" /> Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-gray-800 font-medium">{profileData.phoneNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-800 font-medium">{profileData.address || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {profileData.bio && (
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                      <p className="text-gray-800">{profileData.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={previewImage}
            alt="Full Preview"
            className="max-w-4xl max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </motion.div>
      )}
    </div>
  );
};

export default MyProfile;