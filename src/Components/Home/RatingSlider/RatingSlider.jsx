import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import useRestaurantData from "../../Hooks/useRestaurantData";

const RatingSlider = () => {
  const [restaurantData] = useRestaurantData();
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = restaurantData
    .flatMap((restaurant) => {
      const restaurantReviews = (restaurant.reviews || []).map((review) => ({
        restaurantName: restaurant.restaurantName,
        foodName: null,
        name: review.name || review.customerName || review.user || "Anonymous",
        comment: review.comment || "",
        rating: review.rating?.$numberInt
          ? parseInt(review.rating.$numberInt)
          : 0,
        image: review.userImage || null,
        date:
          review.date?.$date?.$numberLong ||
          review.date ||
          new Date().getTime(),
      }));

      const foodReviews = (restaurant.foods || []).flatMap((food) =>
        (food.reviews || []).map((review) => ({
          restaurantName: restaurant.restaurantName,
          foodName: food.foodName,
          name: review.user || review.customerName || "Anonymous",
          comment: review.comment || "",
          rating: review.rating?.$numberInt
            ? parseInt(review.rating.$numberInt)
            : 0,
          image: review.userImage || null,
          date:
            review.date?.$date?.$numberLong ||
            review.date ||
            new Date().getTime(),
        }))
      );

      return [...restaurantReviews, ...foodReviews];
    })
    .sort((a, b) => b.date - a.date);

  const isLoading = restaurantData.length === 0;

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold font-Caveat text-[#ff1818] mb-4">
          What Our Customers Say
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover why thousands of customers love our food delivery service
        </p>
      </motion.div>

      {/* Slider */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{ delay: 4000 }}
        loop={true}
        modules={[Pagination, Autoplay]}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="pb-12"
      >
        {/* Loading Skeleton */}
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white p-5 rounded-3xl shadow-md w-full h-56 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <Skeleton circle width={64} height={64} />
                    <div className="flex-1">
                      <Skeleton height={15} width="60%" className="mb-1" />
                      <Skeleton height={12} width="40%" />
                    </div>
                  </div>
                  <Skeleton count={3} />
                  <Skeleton width={100} height={20} className="mt-auto" />
                </div>
              </SwiperSlide>
            ))
          : reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`bg-white p-5 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col ${
                    index === activeIndex
                      ? "ring-2 ring-[#ff1818] ring-opacity-50"
                      : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-3">
                    {review.image ? (
                      <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-r from-[#ff1818] to-[#ff5e5e]">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-r from-[#ff1818] to-[#ff5e5e]">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {review.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {review.foodName
                          ? `${review.restaurantName} - ${review.foodName}`
                          : review.restaurantName}
                      </p>
                    </div>
                  </div>

                  {/* Comment */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-700 text-sm mb-3 line-clamp-3"
                  >
                    "{review.comment}"
                  </motion.p>

                  {/* Rating */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center mt-auto"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FaStar
                          className={`mr-1 ${
                            i < review.rating
                              ? "text-[#ff1818]"
                              : "text-[#ff1818]"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default RatingSlider;
