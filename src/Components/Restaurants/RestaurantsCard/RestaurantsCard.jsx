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
import { HiLocationMarker } from "react-icons/hi";
import { motion } from "framer-motion";
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
          return (
            <motion.div
              key={restaurant._id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative w-full max-w-[400px] mx-auto"
            >
              <Card
                shadow={false}
                className="relative h-[400px] border-2 bg-red-50 border-red-600 rounded-xl overflow-hidden transition-transform duration-300"
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="relative h-[250px] bg-cover bg-center"
                >
                  {!loadedBanners[index] && <Skeleton className="w-full h-full" />}
                  <img
                    src={restaurant.banner}
                    alt={`${restaurant.restaurantName} banner`}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loadedBanners[index] ? "opacity-100" : "opacity-0"
                      }`}
                    onLoad={() =>
                      setLoadedBanners(prev => ({ ...prev, [index]: true }))
                    }
                  />
                </CardHeader>

                <CardBody className="text-center p-6">
                  {!loadedAvatars[index] && <Skeleton className="w-24 h-24 mx-auto rounded-full mb-4" />}

                  <Typography className="text-[18px] font-bold font-Caveat text-gray-900 mb-2">
                    {restaurant?.restaurantName || <Skeleton width={150} />}
                  </Typography>

                  <div className="mb-4 flex items-center justify-center space-x-1">
                    <HiLocationMarker className="text-red-600 w-5 h-5" />
                    <Typography className="font-semibold  drop-shadow-xl text-[#ff1818] font-Kanit">
                      {restaurant?.restaurantAddress || <Skeleton width={120} />}
                    </Typography>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Link to={`/restaurantUpload/${restaurant.restaurantName}`}>
                      <Avatar
                        size="xl"
                        variant="circular"
                        alt={restaurant?.restaurantName}
                        className={`border-2 border-gray-300 shadow-lg transition-transform duration-300 ${loadedAvatars[index] ? "opacity-100" : "opacity-0"
                          }`}
                        src={restaurant?.photo}
                        onLoad={() =>
                          setLoadedAvatars(prev => ({ ...prev, [index]: true }))
                        }
                      />
                    </Link>
                  </div>

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
            </motion.div>
          );
        })}
    </div>
  );
};

export default RestaurantsCard;
