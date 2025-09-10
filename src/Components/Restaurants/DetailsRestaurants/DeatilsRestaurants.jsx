import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAddFood from "../../Hooks/useAddFood";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";
import { AiOutlineDelete } from "react-icons/ai";
import useRestaurantData from "../../Hooks/useRestaurantData";
import { RxUpdate } from "react-icons/rx";
import ReactGA from 'react-ga4';
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

const FoodModal = ({ food, open, handleOpen, handleAddFood }) => {
  if (!food) return null;

  const [selectedOption, setSelectedOption] = useState(
    food?.category?.toLowerCase() === "pizza" ? "8" : "full"
  );

  const handleSubmit = () => {
    const foodToAdd = {
      ...food,
      ...(food?.category?.toLowerCase() === "pizza"
        ? { variation: `${selectedOption} inch` }
        : { portion: selectedOption }),
      price: food?.category?.toLowerCase() === "pizza"
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

        {food?.category?.toLowerCase() === "pizza" ? (
          <div className="space-y-4">
            <Typography variant="h6" color="blue-gray">
              Select Pizza Size
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

// Skeleton Loader Component
const FoodCardSkeleton = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col bg-white shadow-md border border-gray-200 rounded-lg w-[380px] h-[420px] mx-auto overflow-hidden">
        <div className="relative h-64 overflow-hidden bg-gray-300 animate-pulse">
          <div className="w-full h-full"></div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="h-6 bg-gray-300 rounded w-2/3 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5 mb-4 animate-pulse"></div>
          <div className="flex justify-end">
            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailsRestaurants = () => {
  const { restaurantName } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartFood, refetch] = useAddFood();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const [isOwner] = useRestaurantOwner();
  const [, refetchTwo] = useRestaurantData();
  const [existingItem, setExistingItem] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get(`/restaurantUpload/${restaurantName}`);
        setFoodItems(res.data?.foods || []);
      } catch (error) {
        console.error("Error fetching food items:", error);
        Swal.fire("Error", "Failed to load food items", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [restaurantName, refetch, refetchTwo, axiosSecure]);

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

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => {
      const ratingValue = review.rating?.$numberInt 
        ? parseInt(review.rating.$numberInt) 
        : typeof review.rating === 'number' 
          ? review.rating 
          : 0;
      return total + ratingValue;
    }, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderSingleRatingStar = (averageRating) => {
    const percentage = (averageRating / 5) * 100;
    
    return (
      <div className="relative w-6 h-4">
        <div className="absolute flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <div className="absolute flex overflow-hidden" style={{ width: `${percentage}%` }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
      </div>
    );
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
      const cartResponse = await axiosSecure.get(`/addItem?email=${user.email}`);
      const alreadyInCart = cartResponse.data.some(item =>
        item.foodName === food.foodName &&
        item.restaurantName === restaurantName
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
        restaurantName,
        foodPrice: food.price,
        foodImage: food.foodImage,
        email: user.email,
        category: food.category,
        quantity: 1,
        ...(food.portion && { portion: food.portion }),
        ...(food.variation && { variation: food.variation }),
        ...(food.toppings && { toppings: food.toppings })
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
        ReactGA.event("add_to_cart", {
          food_name: food.foodName,
          category: food.category,
          price: food.price,
          restaurant: restaurantName,
          user_email: user.email,
        });
        navigate("/dashboard/myOrder");
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
      {(isAdmin || isModerator || isOwner) && (
        <Link to={"/dashboard/addFoods"}>
          <div className="flex justify-end items-end mr-4">
            <button
              className="text-xl font-bold bg-[#ff0000d8] text-white rounded-full shadow-lg p-3 hover:bg-red-700 transition-colors"
              aria-label="Add new food item"
            >
              <MdOutlineAddCircleOutline />
            </button>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 px-6 lg:px-4">
        {loading ? (
          // Skeleton Loaders
          Array.from({ length: 6 }).map((_, index) => (
            <FoodCardSkeleton key={index} />
          ))
        ) : foodItems.length > 0 ? (
          [...foodItems]
            .sort((a, b) => {
              const ratingA = calculateAverageRating(a.reviews);
              const ratingB = calculateAverageRating(b.reviews);
              return ratingB - ratingA; 
            })
            .map((food) => {
              const averageRating = calculateAverageRating(food.reviews);
              const hasReviews = food.reviews && food.reviews.length > 0;
              
              return (
                <motion.div
                  key={food._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  <div className="relative flex flex-col bg-white shadow-md border border-gray-200 rounded-lg w-[380px] h-[420px] mx-auto overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={food.foodImage}
                        alt={`${food.foodName} from ${restaurantName}`}
                        className=" w-[380px] h-[350px] object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      {hasReviews && (
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-sm">
                          {renderSingleRatingStar(averageRating)}
                          <span className="text-sm font-bold text-gray-800 ml-1">
                            {averageRating}
                            <span className="text-xs text-gray-500 ml-1">
                              ({food.reviews.length})
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{food.foodName}</h3>
                        <span className="text-lg font-bold text-red-600">$ {food.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {food.description || `Delicious ${food.foodName} from ${restaurantName}`}
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
              );
            })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No food items available in this restaurant.</p>
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

export default DetailsRestaurants;