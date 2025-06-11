import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";

import Swal from "sweetalert2";

import { AiOutlineDelete } from "react-icons/ai";

import { RxUpdate } from "react-icons/rx";
import useAuth from "../../Hooks/useAuth";
import useAddFood from "../../Hooks/useAddFood";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";
import useRestaurantData from "../../Hooks/useRestaurantData";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const Cake = () => {
  const { restaurantName } = useParams();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartFood, refetch] = useAddFood();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();
  const [isRestaurantData, refetchTwo] = useRestaurantData();
  const [existingItem, setExistingItem] = useState(false);
  const CakeFoods = isRestaurantData
  ?.flatMap((restaurant) =>
    restaurant?.foods?.map((food) => ({
      ...food,
      restaurantName: restaurant?.restaurantName,
    }))
  )
  ?.filter((food) => food?.category === "Cake") || []; 

console.log("Cake Foods Data:", CakeFoods); 

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [restaurantName, refetch, refetchTwo]);

  useEffect(() => {
    if (user && user.email && cart.fooName) {
      axiosSecure
        .get(`/addItem?email=${user?.email}`)
        .then((res) => {
          const itemInCart = res.data.some(
            (cartEntry) => cartEntry.foodName === cart.fooName
          );
          setExistingItem(itemInCart);
        })
        .catch((error) => console.error("Error checking cart:", error));
    }
  }, [user, axiosSecure, cart.foodName]);

  // ✅ Handle Food Deletion
 
  // ✅ Handle Add Food to Cart
  const handleAddFood = (food) => {
    if (user && user.email) {
      const foodInfo = {
        foodId: food._id,
        foodName: food.foodName,
        restaurantName: food.restaurantName, // ✅ এখানে রেস্টুরেন্ট নাম সঠিকভাবে আছে
        foodPrice: food.price,
        foodImage: food.foodImage,
        email: user.email,
        category: food.category,
      };

      axiosSecure
        .post("/addFood", foodInfo)
        .then((res) => {
          if (res.data.insertedId) {
            Swal.fire("Success!", "Food added successfully!", "success");
            refetch();
            navigate("/dashboard/myOrder");
            const updatedCart = [...cart, food];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setIsCartOpen(true);
          }
        })
        .catch(() => Swal.fire("Error", "Error adding food", "error"));
    } else {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to add food to your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen mb-5">
      <br />
      {/* {isAdmin || isModerator || isOwner ? (
        <Link to={"/dashboard/addFoods"}>
          <div className="flex justify-end items-end">
            <button className="text-xl font-bold bg-[#ff0000d8] text-white rounded-full shadow-lg p-3">
              <MdOutlineAddCircleOutline />
            </button>
          </div>
        </Link>
      ) : null} */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-6 lg:px-4">
        {CakeFoods.length > 0 ? (
          CakeFoods.map((food, index) => ( // ✅ Fixed `CakeFoods.foods`
            <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="relative flex flex-col bg-white shadow-md border border-gray-200 rounded-lgw-[330px] h-[360px]  lg:w-[400px] lg:h-[450px] mx-auto px-2 py-2">
                <div className="relative overflow-hidden rounded-md">
                  <motion.img src={food.foodImage} alt={food.foodName} className="h-full w-full object-cover" whileHover={{ scale: 1.1 }} />
                </div>
                <div className="p-4">
                  <p className="mb-2 bg-[#ff0000d8] text-white text-xs py-1 px-3 rounded-full w-fit">{food.foodName || "Unavailable"}</p>
                  {/* <p className="mb-2 bg-[#ff0000d8] text-white text-xs py-1 px-3 rounded-full w-fit">{food.category || "Unavailable"}</p> */}
                  <div className="flex justify-between items-center">
                   <p className="text-red-500 text-sm">
                      Delicious {food.foodName} from{" "}
                      <Link to={`/restaurantUpload/${food.restaurantName}`}>
                        <span className="font-bold">{food.restaurantName}</span>
                      </Link>
                      . Price: ${food.price}
                    </p>

                

                    {existingItem ? (
                      <Link to="/dashboard/myOrder">
                        <Button className="text-[#ff1818]">Check Your Cart</Button>
                      </Link>
                    ) : (
                      <motion.button
                        onClick={() => handleAddFood(food)}
                        className="text-xl font-bold bg-[#ff0000d8] text-white rounded-full shadow-lg p-3 ml-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MdOutlineAddCircleOutline />
                      </motion.button>
                    )}

                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default Cake;
