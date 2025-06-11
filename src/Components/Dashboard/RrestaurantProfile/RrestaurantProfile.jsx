import { MdOutlineAdminPanelSettings, MdOutlineRestaurant } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

import { Input } from "@material-tailwind/react";
import useAllUserHooks from "../../Hooks/useAllUserHooks";

const RestaurantProfile = () => {
    const [searchInput, setSearchInput] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const axiosSecure = useAxiosSecure();
    const [users, , refetch] = useAllUserHooks(); // Ensure refetch is functional
    const TABLE_HEAD = ["Information", "Action", "Restaurant Owner"];

    // Filter users by tab and search
    const filteredUsers = (users || []).filter((user) => {
        const userSearch =
            user.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchInput.toLowerCase());

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "owner" && user.role === "owner");

        return userSearch && matchesTab;
    });

    const handleDelete = (userId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure
                    .delete(`/users/${userId}`)
                    .then(() => {
                        refetch();
                        Swal.fire("Deleted!", "The user has been deleted.", "success");
                    })
                    .catch(() => {
                        Swal.fire("Error!", "Failed to delete the user.", "error");
                    });
            }
        });
    };

    const handleOwner = (userId) => {
        axiosSecure.patch(`/users/restaurantOwner/${userId}`).then((res) => {
            if (res.data.modifiedCount > 0) {
                refetch();
                toast.success("Successfully updated to Restaurant Owner");
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto min-h-full">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Manage Users</h2>
                <div className="w-64">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute h-5 w-5  top-3 left-3" />
                        <Input
                            type="text"
                            className="input text-orange-700 w-full pl-10 ext-orange-500 font-bold"
                            placeholder="Search users..."
                            value={searchInput}
                            color="orange"
                            label="Serach Restaurant Owner"
                            onChange={(e) => setSearchInput(e.target.value)}
                            aria-label="Search users"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs  mb-4">
                <button
                    className={`tab ${activeTab === "all" ? "tab-active bg-orange-900 text-white font-bold rounded-full shadow-2xl" : "font-bold text-orange-900"}`}
                    onClick={() => setActiveTab("all")}
                >
                    All Restaurant Users
                </button>
                <button
                    className={`tab ${activeTab === "owner" ? "tab-active bg-orange-900 text-white font-bold rounded-full shadow-2xl" : "font-bold text-orange-900"}`}
                    onClick={() => setActiveTab("owner")}
                >
                    Restaurant Owners
                </button>
            </div>

            {/* Table */}
            <div className="overflow-auto">
                <table className="table-auto w-full ">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="px-4 py-2 border">
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(({ _id, name, email,
                                restaurantNumber, photo,
                                restaurantAdddress, role, avatar }) => (
                                <tr key={_id} className="">
                                    <td className="px-4 py-2 border flex items-center space-x-4">
                                        <img
                                            src={avatar || photo} alt={name || "User Avatar"}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p>{name}</p>
                                            <p className="text-sm text-gray-500">{email}</p>
                                            <p className="text-sm text-gray-500">
                                                {restaurantAdddress}</p>
                                            <p className="text-sm text-gray-500">{restaurantNumber}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            className="text-xl font-extrabold shadow-2xl "
                                            onClick={() => handleDelete(_id)}
                                            aria-label={`Delete ${name}`}
                                        >
                                            <AiOutlineUserDelete />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {role === "owner" ? (
                                            <span className="font-bold">Owner</span>
                                        ) : (
                                            <button
                                                className="text-xl font-extrabold shadow-2xl "
                                                onClick={() => handleOwner(_id)}
                                                aria-label={`Promote ${name} to Owner`}
                                            >
                                                <MdOutlineRestaurant />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RestaurantProfile;
