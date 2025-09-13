import { useState, useContext, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AddDistrictCollection = () => {
  const { user } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    let imageUrl = previewImage;

    if (selectedFile) {
      try {
        const imageData = await imageUpload(selectedFile);
        imageUrl = imageData?.data?.display_url || "";
      } catch (error) {
        toast.error("Image upload failed");
        return;
      }
    }

    const district = {
      photo: imageUrl,
      districtName: data.districtName
    };

    axiosSecure.post("/districtAvailable", district)
      .then((res) => {
        if (res.data.insertedId) {
          toast.success("District uploaded successfully!");
          navigate("/");
        } else {
          toast.error("Failed to upload district.");
        }
      })
      .catch(() => toast.error("Something went wrong."));
  };

  return (
    <div className="min-h-screen  bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
        {/* Image Upload Side */}
        <div className="md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-6 relative">
          <img
            src={previewImage || "https://i.ibb.co.com/HL4RKtR3/cox-sbazar.jpg"}
            alt="Preview"
            onClick={handleImageClick}
            className="w-48 h-48 object-cover rounded-full border-4 border-white cursor-pointer hover:opacity-80 transition"
          />
          <div
            onClick={handleImageClick}
            className="absolute bottom-8 flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-full shadow cursor-pointer hover:bg-red-100 transition"
          >
            <IoCloudUploadOutline className="text-xl" />
            Upload Image
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            name="photo"
            onChange={handleFileChange}
          />
        </div>

        {/* Form Side */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-1/2 p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-[#ff1818] mb-4">Add District</h2>

          {/* District Dropdown */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Select District
            </label>
            <select
              {...register("districtName", {
                required: "Please select a district"
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>Select a district</option>
              {[
                "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur",
                "Manikganj", "Munshiganj", "Mymensingh", "Narsingdi", "Narayanganj", "Tangail",
                "Shariatpur", "Netrokona", "Chittagong", "Bandarban", "Brahmanbaria", "Chandpur",
                "Feni", "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati", "Cox'sbazar",
                "Khulna", "Bagerhat", "Chuadanga", "Jessore", "Jhenaidah", "Kushtia",
                "Meherpur", "Mongla", "Satkhira", "Barishal", "Barguna", "Bhola", "Jhalokathi",
                "Patuakhali", "Pirojpur", "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj",
                "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari",
                "Panchagarh", "Thakurgaon", "Rajshahi", "Bogra", "Chapai Nawabganj", "Naogaon",
                "Natore", "Pabna", "Shibganj"
              ].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.districtName && (
              <p className="text-sm text-[#ff1818] mt-1">{errors.districtName.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ff1818] hover:bg-red-600 text-white font-semibold py-2 rounded-md transition shadow"
          >
            Upload District
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDistrictCollection;
