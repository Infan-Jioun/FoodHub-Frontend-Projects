import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import { FaEdit } from 'react-icons/fa';
import useAdmin from '../../Hooks/useAdmin';
import useModerator from '../../Hooks/useModerator';
import useRestaurantOwner from '../../Hooks/useRestaurantOwner';
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import { AiOutlineDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import UpdateFoodModal from '../UpdateFoodModal/UpdateFoodModal';
import { RxUpdate } from 'react-icons/rx';

const ManageMenu = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin] = useAdmin();
    const [isModerator] = useModerator();
    const [isOwner] = useRestaurantOwner();
    const [selectedFood, setSelectedFood] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { data: restaurant = {}, isLoading, refetch } = useQuery({
        queryKey: ['restaurantData', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/restaurantManage/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const handleDelete = (restaurantName, foodName) => {
        if (!(isAdmin || isModerator || isOwner)) {
            return Swal.fire("Unauthorized", "You are not authorized to delete", "error");
        }

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
                axiosSecure.delete(`/restaurantManage/${restaurantName}/${foodName}`)
                    .then((res) => {
                        if (res.data.success) {
                            Swal.fire("Deleted!", "Food item deleted successfully.", "success");
                            refetch();
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Failed to delete", "error");
                    });
            }
        });
    };

    if (isLoading) return <div className="flex justify-center items-center min-h-screen">
        <img
            src="https://i.ibb.co.com/F57mtch/logo2.png"
            alt="Loading Logo"
            className="w-28 h-28 object-contain animate-pulse"
        />
    </div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Menu for {restaurant.restaurantName}</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Food Items ({restaurant.foods?.length || 0})</h2>
                    <Link to={"/dashboard/addFoods"}>
                        <button className="bg-[#ff1818] hover:bg-[#ff1818] text-white px-4 py-2 rounded">
                            Add New Food Item
                        </button>
                    </Link>
                </div>

                {restaurant.foods?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                   
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {restaurant.foods.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={item.foodImage}
                                                alt={item.foodName}
                                                className="h-12 w-12 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/50';
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.foodName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{item.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${item.price}</div>
                                        </td>
                                       
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                {(isAdmin || isModerator || isOwner) && (
                                                    <>
                                                        <motion.button
                                                            onClick={() => {
                                                                setSelectedFood(item);
                                                                setShowModal(true);
                                                            }}
                                                            className="text-xl font-bold bg-[#ff1818] text-white rounded-full shadow-lg p-2 hover:bg-[#ff1818]"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            aria-label={`Edit ${item.foodName}`}
                                                        >
                                                            <RxUpdate/>
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleDelete(restaurant.restaurantName, item.foodName)}
                                                            className="text-xl font-bold bg-[#ff1818] text-white rounded-full shadow-lg p-2 hover:bg-[#ff1818]"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            aria-label={`Delete ${item.foodName}`}
                                                        >
                                                            <AiOutlineDelete />
                                                        </motion.button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No food items found. Add your first menu item!</p>
                    </div>
                )}
            </div>

            {/* Update Food Modal */}
            {showModal && (
                <UpdateFoodModal
                    restaurantName={restaurant.restaurantName}
                    food={selectedFood}
                    refetch={refetch}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ManageMenu;