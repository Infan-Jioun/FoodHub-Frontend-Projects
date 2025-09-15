import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FiClock, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';

const WebsiteReviewSlider = () => {
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/website-reviews');
        setReviews(res.data.reviews || []);
      } catch (err) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [axiosSecure]);

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <FiStar
              className={`w-5 h-5 ${i < rating ? 'text-[#ff1818] fill-[#ff1818]' : 'text-gray-300'
                }`}
            />
          </motion.div>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Skeleton loader
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Skeleton width={200} height={30} className="mx-auto mb-4" />
          <Skeleton width={300} height={20} className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <Skeleton circle width={50} height={50} />
                <div>
                  <Skeleton width={120} height={20} />
                  <Skeleton width={80} height={16} className="mt-1" />
                </div>
              </div>
              <Skeleton count={3} className="mb-4" />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} circle width={20} height={20} className="mr-1" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-16 text-center"
      >
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl inline-block">
          <p>Error: {error}</p>
        </div>
      </motion.div>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-16 text-center"
      >
        <div className="bg-gray-50 text-gray-700 p-6 rounded-2xl inline-block">
          <p>No reviews yet. Be the first to leave a review!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16  my-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-Caveat font-bold text-[#ff1818] mb-4">
          What Our Customers Say FOR Web
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover why thousands of customers love our food delivery service
        </p>
      </motion.div>

      {/* Review Slider */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{
            clickable: true,
            el: '.review-pagination',
            bulletClass: 'review-bullet',
            bulletActiveClass: 'review-bullet-active'
          }}
          navigation={{
            prevEl: '.review-prev',
            nextEl: '.review-next',
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="pb-12"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={review._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`bg-white p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 flex flex-col h-full ${index === activeIndex ? 'ring-2 ring-[#ff1818] ring-opacity-50' : ''
                  }`}
              >
                {/* Review Header */}
                <div className="flex items-center gap-4 mb-4">
                  {review.photoURL ? (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      src={review.photoURL}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-[#ff1818] to-[#ff5e5e] flex items-center justify-center text-white font-bold text-xl shadow-md"
                    >
                      {review.name?.[0]?.toUpperCase() || 'U'}
                    </motion.div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <StarRating rating={review.rating} />
                </motion.div>

                {/* Review Content */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-700 flex-grow leading-relaxed"
                >
                  "{review.comment}"
                </motion.p>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-10">
                  <FiStar className="w-8 h-8 text-[#ff1818]" />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}

        <div className="flex justify-center px-16 items-center gap-4 mt-6">
          <button className="review-prev bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow focus:outline-none hover:bg-[#ff1818] hover:text-white group">
            <FiChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-white" />
          </button>

          {/* Custom Pagination */}
          <div className="review-pagination flex justify-center gap-2 mx-4" />

          <button className="review-next bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow focus:outline-none hover:bg-[#ff1818] hover:text-white group">
            <FiChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white" />
          </button>
        </div>

      </div>

      {/* Style for custom pagination */}
      <style jsx>{`
        .review-bullet {
          width: 10px;
          height: 10px;
         
          border-radius: 50%;
          display: inline-block;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .review-bullet-active {
          background: #ff1818;
          width: 30px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default WebsiteReviewSlider;