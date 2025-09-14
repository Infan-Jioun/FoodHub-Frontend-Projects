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
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IoLocationOutline } from "react-icons/io5";

const RestaurantsCard = () => {
  const [isRestaurantData, refetch, isLoading] = useRestaurantData();
  const [isAdmin] = useAdmin();
  const [isModerator] = useModerator();
  const axiosSecure = useAxiosSecure();


  const getRestaurantRating = (restaurant) => {
    if (!restaurant.reviews || restaurant.reviews.length === 0) return { average: 0, total: 0 };

    const totalReviews = restaurant.reviews.length;
    const totalRating = restaurant.reviews.reduce((sum, review) => {
      const rating = review.rating?.$numberInt ? parseInt(review.rating.$numberInt) : review.rating;
      return sum + (rating || 0);
    }, 0);

    const average = (totalRating / totalReviews).toFixed(1);
    return { average, total: totalReviews };
  };

  const handleDeleted = (restaurantId) => {
    if (isAdmin || isModerator) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff1818",
        cancelButtonColor: "#ff1818",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.delete(`/restaurantUpload/${restaurantId}`)
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
      <AnimatePresence>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative w-full max-w-[400px] h-[400px] border-2 bg-red-50 border-red-600 mx-auto rounded-xl overflow-hidden">
                <CardHeader className="relative h-[250px]">
                  <Skeleton height={250} />
                </CardHeader>
                <CardBody className="text-center p-6">
                  <Skeleton height={25} width="60%" className="mb-2 mx-auto" />
                  <Skeleton height={20} width="80%" className="mb-4 mx-auto" />
                  <div className="flex justify-center mb-4">
                    <Skeleton circle={true} height={80} width={80} />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Skeleton height={20} width={50} />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Skeleton circle={true} height={35} width={35} />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))
          : [...isRestaurantData]
            .sort((a, b) => getRestaurantRating(b).total - getRestaurantRating(a).total)
            .map((restaurant) => {
              const { average, total } = getRestaurantRating(restaurant);

              return (
                <motion.div
                  key={restaurant._id.$oid || restaurant._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    shadow={false}
                    className="relative w-full max-w-[400px] h-[400px] border-2 bg-red-50 border-red-600 mx-auto rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105"
                  >
                    <CardHeader
                      floated={false}
                      shadow={false}
                      className="relative h-[250px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${restaurant.banner})` }}
                    >
                      <div className="absolute inset-0 transition-all duration-300" />
                    </CardHeader>

                    <CardBody className="text-center p-6">
                      <Typography className="text-[18px] font-bold font-Caveat text-gray-900">
                        {restaurant?.restaurantName}
                      </Typography>
                      <div>
                        <div className="mt-2 flex items-center justify-center text-gray-700">
                          <IoLocationOutline className="mr-1 text-[#ff1818]" />
                          <Typography className="font-Poppins text-[#ff1818] font-semibold text-sm">
                            {restaurant?.restaurantAddress || "Address not available"}
                          </Typography>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Link to={`/restaurantUpload/${restaurant.restaurantName}`}>
                          <Avatar
                            size="xl"
                            variant="circular"
                            alt={restaurant?.restaurantName}
                            className="border-2 border-gray-300 shadow-lg transition-transform duration-300 hover:scale-110"
                            src={restaurant?.photo}
                          />
                        </Link>
                      </div>

                      {average > 0 && (
                        <motion.div
                          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaStar className="text-[#ff1818] mr-1" />
                          <span className="font-bold text-gray-800">{average}</span>
                          <span className="text-sm text-gray-500 ml-1">({total} reviews)</span>
                        </motion.div>
                      )}

                      {(isAdmin || isModerator) && (
                        <motion.button
                          onClick={() => handleDeleted(restaurant._id.$oid || restaurant._id)}
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
      </AnimatePresence>
    </div>
  );
};

export default RestaurantsCard;
