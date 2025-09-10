import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import useRestaurantData from "../../Hooks/useRestaurantData";
import { Link } from "react-router-dom";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RestaurantsCard = () => {
  const [isRestaurantData, refetch] = useRestaurantData();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const axiosSecure = useAxiosSecure();
  const [loadedBanners, setLoadedBanners] = useState({});
  const [loadedAvatars, setLoadedAvatars] = useState({});

  const getRestaurantRating = (restaurant) => {
    if (!restaurant.foods) return { average: 0, total: 0 };
    
    let totalRating = 0;
    let totalReviews = 0;
    
    restaurant.foods.forEach(food => {
      if (food.reviews?.length) {
        const foodTotal = food.reviews.reduce((sum, review) => sum + review.rating, 0);
        totalRating += foodTotal;
        totalReviews += food.reviews.length;
      }
    });
    
    const average = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
    return { average, total: totalReviews };
  };

  const handleDeleted = (food) => {
    if (isAdmin || isModerator) {
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
          axiosSecure.delete(`/restaurantUpload/${food}`)
            .then((res) => {
              if (res.data.deletedCount > 0) {
                toast.success("Successfully Deleted");
              }
              refetch();
            })
            .catch((error) => {
              console.error("Error deleting:", error);
              toast.error("Failed to delete");
            });
        }
      });
    } else {
      toast.error("You are not authorized to delete");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-7 px-8 max-w-7xl mx-auto mt-10 mb-10 min-h-screen">
      {[...isRestaurantData]
        .sort((a, b) => getRestaurantRating(b).total - getRestaurantRating(a).total)
        .map((restaurant, index) => {
          const { average, total } = getRestaurantRating(restaurant);
          
          return (
            <Card
              key={restaurant._id}
              shadow={false}
              className="relative w-full max-w-[400px] h-[400px] border-2 bg-red-50 border-red-600 mx-auto rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105"
            >
              <CardHeader
                floated={false}
                shadow={false}
                className="relative h-[250px] bg-cover bg-center"
              >
                {!loadedBanners[index] && (
                  <Skeleton height="100%" width="100%" className="absolute top-0 left-0" />
                )}
                <img
                  src={restaurant.banner}
                  alt={`${restaurant.restaurantName} banner`}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    loadedBanners[index] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() =>
                    setLoadedBanners(prev => ({ ...prev, [index]: true }))
                  }
                />
              </CardHeader>

              <CardBody className="text-center p-6">
                <Typography className="text-[18px] font-bold font-Caveat text-gray-900">
                  {restaurant?.restaurantName}
                </Typography>
                <Typography className="mb-2 font-bold drop-shadow-xl text-red-500 font-Kanit">
                  {restaurant?.restaurantAddress}
                </Typography>

                <div className="mt-4 flex justify-center">
                  {!loadedAvatars[index] && (
                    <Skeleton height={80} width={80} circle className="absolute" />
                  )}
                  <Link to={`/restaurantUpload/${restaurant.restaurantName}`}>
                    <Avatar
                      size="xl"
                      variant="circular"
                      alt={restaurant?.restaurantName}
                      className={`border-2 border-gray-300 shadow-lg transition-transform duration-300 hover:scale-110 ${
                        loadedAvatars[index] ? "opacity-100" : "opacity-0"
                      }`}
                      src={restaurant?.photo}
                      onLoad={() =>
                        setLoadedAvatars(prev => ({ ...prev, [index]: true }))
                      }
                    />
                  </Link>
                </div>

                {average > 0 && (
                  <motion.div 
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaStar className="text-red-500 mr-1" />
                    <span className="font-bold text-gray-800">{average}</span>
                  </motion.div>
                )}

                {(isAdmin || isModerator) && (
                  <motion.button
                    onClick={() => handleDeleted(restaurant.restaurantName)}
                    className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-md hover:bg-red-700 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AiOutlineDelete size={20} />
                  </motion.button>
                )}
              </CardBody>
            </Card>
          );
        })}
    </div>
  );
};

export default RestaurantsCard;
