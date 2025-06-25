import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";

import Swal from "sweetalert2";


import { AiOutlineDelete } from "react-icons/ai";

import { RxUpdate } from "react-icons/rx";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Radio,
  Typography,
  Card,
  CardBody,
  IconButton
} from "@material-tailwind/react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAddFood from "../../../Hooks/useAddFood";
import useAdmin from "../../../Hooks/useAdmin";
import useModerator from "../../../Hooks/useModerator";
import useRestaurantData from "../../../Hooks/useRestaurantData";
import useAuth from "../../../Hooks/useAuth";
import useRestaurantOwner from "../../../Hooks/useRestaurantOwner";

const FoodModal = ({ food, open, handleOpen, handleAddFood }) => {
  if (!food) return null;

  const [selectedOption, setSelectedOption] = useState(
    food?.category?.toLowerCase() === "Burger" ? "8" : "full"
  );

  const handleSubmit = () => {
    const foodToAdd = {
      ...food,
      ...(food?.category?.toLowerCase() === "Burger"
        ? { variation: `${selectedOption} inch` }
        : { portion: selectedOption }),
      price: food?.category?.toLowerCase() === "Burger"
        ? selectedOption === "8" ? food.price : food.price * 1.5
        : selectedOption === "full" ? food.price : food.price * 0.6
    };
    handleAddFood(foodToAdd);
    handleOpen();
  };

  return (
    <Dialog open={open} handler={handleOpen} size="md" className="bg-red-50">
      <DialogHeader className="flex justify-between items-center">
        <div>
          <Typography variant="h5" color="blue-gray">
            {food.foodName}
          </Typography>
          <Typography color="gray" className="font-normal">
            {food.description || `Delicious ${food.foodName}`}
          </Typography>
        </div>
        <IconButton
          color="blue-gray"
          variant="text"
          onClick={handleOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-auto">
        <Card className="mb-4">
          <CardBody className="p-4">
            <img
              src={food.foodImage}
              alt={food.foodName}
              className="w-64 h-64 mx-auto drop-shadow-2xl rounded-lg"
            />
          </CardBody>
        </Card>

        {food?.category?.toLowerCase() === "Burger" ? (
          <div className="space-y-4">
            <Typography variant="h6" color="blue-gray">
              Select Burger Size
            </Typography>

            <Radio
              id="size8"
              name="size"
              label={
                <div>
                  <Typography color="blue-gray" className="font-medium">
                    8 Inch
                  </Typography>
                  <Typography color="blue-gray" className="text-sm">
                    <span className="text-red-500 font-bold">$ {(food.price * 1).toFixed(0)}</span>
                  </Typography>
                </div>
              }
              value="8"
              checked={selectedOption === "8"}
              onChange={() => setSelectedOption("8")}
            />

            <Radio
              id="size12"
              name="size"
              label={
                <div>
                  <Typography color="blue-gray" className="font-medium">
                    12 Inch
                  </Typography>
                  <Typography color="blue-gray" className="text-sm">
                    <span className="text-red-500 font-bold">$ {(food.price * 1.5).toFixed(0)}</span>
                  </Typography>
                </div>
              }
              value="12"
              checked={selectedOption === "12"}
              onChange={() => setSelectedOption("12")}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Typography variant="h6" color="blue-gray">
              Select Portion
            </Typography>

            <Radio
              id="full"
              name="portion"
              label={
                <div>
                  <Typography color="blue-gray" className="font-medium">
                    Full Portion
                  </Typography>
                  <Typography color="blue-gray" className="text-sm">
                    <span className="text-red-500 font-bold">$ {food.price}</span>
                  </Typography>
                </div>
              }
              value="full"
              checked={selectedOption === "full"}
              onChange={() => setSelectedOption("full")}
            />

            <Radio
              id="half"
              name="portion"
              label={
                <div>
                  <Typography color="blue-gray" className="font-medium">
                    Half Portion
                  </Typography>
                  <Typography color="blue-gray" className="text-sm">
                    <span className="text-red-500 font-bold">$ {(food.price * 0.6).toFixed(0)}</span>
                  </Typography>
                </div>
              }
              value="half"
              checked={selectedOption === "half"}
              onChange={() => setSelectedOption("half")}
            />
          </div>
        )}

        <div className="mt-6">
          <Typography variant="small" color="gray" className="font-normal">
            <span className="font-semibold">Popular:</span> Topped with mozzarella cheese,
            secret sauce, chicken, tomato, and special spices
          </Typography>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="mr-1"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={handleSubmit}
          className="flex items-center gap-2"
        >
          <MdOutlineAddCircleOutline className="h-5 w-5" />
          Add to Cart
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

const Burger = () => {
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
  const [existingItem, setExistingItem] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const BurgerFoods = isRestaurantData
    ?.flatMap((restaurant) =>
      restaurant?.foods?.map((food) => ({
        ...food,
        restaurantName: restaurant?.restaurantName,
      }))
    )
    ?.filter((food) => food?.category === "Burger") || [];

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [restaurantName, refetch, refetchTwo]);

  useEffect(() => {
    if (user?.email) {
      checkCartItems();
    }
  }, [user, axiosSecure, cartFood]);

  const checkCartItems = async () => {
    try {
      const res = await axiosSecure.get(`/addItem?email=${user.email}`);
      const itemsMap = {};
      res.data.forEach(item => {
        itemsMap[item.foodName] = true;
      });
      setExistingItem(itemsMap);
    } catch (error) {
      console.error("Error checking cart:", error);
    }
  };

  const handleAddFood = async (food) => {
    if (!user?.email) {
      return Swal.fire({
        title: "Login Required",
        text: "Please log in to add food to your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    }

    try {
      // Check if item already exists in cart
      const cartResponse = await axiosSecure.get(`/addItem?email=${user.email}`);
      const alreadyInCart = cartResponse.data.some(item =>
        item.foodName === food.foodName &&
        item.restaurantName === food.restaurantName
      );

      if (alreadyInCart) {
        return Swal.fire({
          icon: "warning",
          title: "Already in Cart",
          text: "This item is already in your cart",
          confirmButtonText: "View Cart",
          showCancelButton: true,
          cancelButtonText: "Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard/myOrder");
          }
        });
      }

      const foodInfo = {
        foodId: food._id,
        foodName: food.foodName,
        restaurantName: food.restaurantName,
        foodPrice: food.price,
        foodImage: food.foodImage,
        email: user.email,
        category: food.category,
        quantity: 1,
        ...(food.portion && { portion: food.portion }),
        ...(food.variation && { variation: food.variation })
      };

      const res = await axiosSecure.post("/addFood", foodInfo);
      if (res.data.insertedId) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Added to Cart!",
          showConfirmButton: false,
          timer: 1000,
        });
        refetch();
        navigate("/dashboard/myOrder");
        const updatedCart = [...cart, food];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error("Error adding food:", error);
      Swal.fire("Error", "Failed to add food to cart", "error");
    }
  };

  const showFoodOptions = (food) => {
    if (!user?.email) {
      return Swal.fire({
        title: "Login Required",
        text: "Please log in to add food to your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    }

    // Check if item already exists in cart
    if (existingItem[food.foodName]) {
      return Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: "This item is already in your cart",
        confirmButtonText: "View Cart",
        showCancelButton: true,
        cancelButtonText: "Continue Browsing"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/myOrder");
        }
      });
    }

    setSelectedFood(food);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen mb-5">
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-6 lg:px-4">
        {BurgerFoods.length > 0 ? (
          BurgerFoods.map((food, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative flex flex-col bg-white shadow-md border border-gray-200 rounded-lg w-full max-w-[400px] h-[400px] mx-auto overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={food.foodImage}
                    alt={`${food.foodName} from ${food.restaurantName}`}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{food.foodName}</h3>
                    <span className="text-lg font-bold text-red-600">$ {food.price}</span>
                  </div>
                   <p className="text-red-500 text-sm">
                      Delicious {food.foodName} from{" "}
                      <Link to={`/restaurantUpload/${food.restaurantName}`}>
                        <span className="font-bold">{food.restaurantName}</span>
                      </Link>
                      . Price: ${food.price}
                    </p>
                  <div className="flex justify-between items-center">
                    {existingItem[food.foodName] ? (
                      <button
                        onClick={() => navigate("/dashboard/myOrder")}
                        className="bg-[#ff0000d8] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        View Cart
                      </button>
                    ) : (
                      <motion.button
                        onClick={() => showFoodOptions(food)}
                        className="text-xl font-bold bg-[#ff0000d8] text-white rounded-full shadow-lg p-2 ml-auto hover:bg-red-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`Add ${food.foodName} to cart`}
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
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No Burger items available.</p>
            <Link
              to="/restaurants"
              className="mt-4 inline-block bg-[#ff0000d8] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse Other Restaurants
            </Link>
          </div>
        )}
      </div>

      {selectedFood && (
        <FoodModal
          open={modalOpen}
          handleOpen={() => setModalOpen(!modalOpen)}
          food={selectedFood}
          handleAddFood={handleAddFood}
        />
      )}
    </div>
  );
};

export default Burger;