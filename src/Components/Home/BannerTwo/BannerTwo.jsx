import { useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

const BannerTwo = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-20 relative mb-20">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 px-4 justify-center items-center md:gap-6 lg:gap-10 md:px-10 lg:px-16">
        {/* Image Section */}
        <div className="sm:px-4 relative w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px] rounded-lg overflow-hidden">
          {!loaded && (
            <Skeleton
              height="100%"
              width="100%"
              className="absolute top-0 left-0"
            />
          )}
          <motion.img
            src="https://i.ibb.co.com/VJTbsNp/welcome-bg-png.webp"
            alt="Welcome"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.95 }}
            transition={{ duration: 1 }}
            onLoad={() => setLoaded(true)}
          />

        
        </div>

        {/* Text Section */}
        <div className="flex justify-center items-center mt-6 sm:mt-0">
          <motion.div
            className="md:w-80 lg:w-96"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="md:text-sm lg:text-[16px] mb-4">
              Created god gathered don't you yielding herb you had. And isn't,
              god was saw. Dominion. Great sixth for in unto was. Open can't
              tree am waters brought. Divide after there.
            </p>
            <p className="md:text-sm lg:text-[16px] mb-6">
              Created god gathered don't you yielding herb you had. And isn't,
              god was saw. Dominion. Great sixth for in unto was. Open can't
              tree waters brought. Divide after there. Was. Created god gathered
              don't you yielding herb you had. And isn't god.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="https://foodhub-d3e1e.web.app/restaurantUpload/7dayz">
                <button className="w-full sm:w-auto rounded-lg border-2 p-3 px-5 border-[#ff1818] bg-[#ff1818] text-white font-semibold hover:transition-colors hover:bg-white hover:text-[#ff1818] shadow-lg">
                  BOOK A FOOD
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BannerTwo;
