import { useState, useContext, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Provider/AuthProvider/AuthProvider";
import { imageUpload } from "../../Hooks/imageHooks";
import { option, Select } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AddDistrictCollection = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(""); // Image Preview
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();

    // Open File Picker
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Handle Image Selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file)); // Preview selected image
        }
    };

    // Handle Form Submission
    const onSubmit = async (data) => {
        let imageUrl = previewImage; // Default preview image

        if (selectedFile) {
            try {
                const imageData = await imageUpload(selectedFile);
                imageUrl = imageData?.data?.display_url || "";
            } catch (error) {
                console.error("Image upload failed:", error);
                toast.error("Image upload failed");
                return;
            }
        }

        const district = {
            photo: imageUrl,
            districtName: data.districtName
        };

        axiosSecure.post("/districtAvailable", district)
            .then(res => {
                if (res.data.insertedId) {
                    toast.success("District uploaded successfully!");
                    navigate("/")

                } else {
                    toast.error("Failed to upload district.");
                }
            })
            .catch(error => {
                console.error("Error uploading district:", error);
                toast.error("Something went wrong.");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-11/12 md:w-8/12 lg:w-6/12 border border-red-300 rounded-lg shadow-xl p-10">

                {/* Profile Image Section */}
                <div className="relative w-40 h-40 mx-auto">
                    <img
                        className="w-full h-full rounded-full object-cover border-4 border-gray-300 cursor-pointer transition duration-300 hover:opacity-70"
                        src={previewImage || "https://i.ibb.co.com/HL4RKtR3/cox-sbazar.jpg"}
                        alt="Profile"
                        onClick={handleImageClick}
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-semibold opacity-0 hover:opacity-100 transition duration-300 cursor-pointer"
                        onClick={handleImageClick}
                    >
                        <IoCloudUploadOutline />
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    name="photo"
                    onChange={handleFileChange}
                />
                <br />

                {/* District Selection */}
                <select
                    {...register("districtName", { required: "District selection is required" })} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    // onChange={(e) => setValue("districtName", e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled> Select a district </option>
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

                {errors.districtName && <p className="text-red-500 mt-1">{errors.districtName.message}</p>}



                {/* Submit Button */}
                <br />
                <br />
                <button
                    type="submit"
                    className="w-full bg-[#ff0000d8] text-white py-2 rounded-lg font-semibold shadow-md hover:bg-[#ff0000d8] transition duration-300"
                >
                    Upload District
                </button>
            </form>
        </div>
    );
};

export default AddDistrictCollection;
