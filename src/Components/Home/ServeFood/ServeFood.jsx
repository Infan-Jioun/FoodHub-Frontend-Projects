
import { useState } from "react";
import { FaUtensilSpoon, FaFireAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ServeFood = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-5">
      <div className="relative h-[500px]">
        {/* Skeleton for loading */}
        {!loaded && (
          <Skeleton height="100%" width="100%" className="absolute top-0 left-0" />
        )}

        {/* Background Image */}
        <img
          src="https://i.ibb.co.com/zRQk4Bw/chef-service.jpg"
          alt="Chef Service"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-center px-4">
          <motion.div
            className="w-full max-w-[400px] md:max-w-3xl rounded-3xl bg-[#ff1818] p-6 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white">FOODHUB</h1>
            <p className="mb-6 text-sm md:text-lg text-white">
              A restaurant chef is a culinary artist who creates delicious and visually
              appealing dishes. They manage the kitchen, oversee food preparation, and
              ensure quality and consistency.
            </p>

            {/* Feature List */}
            <ul className="text-white text-left text-sm md:text-base space-y-4">
              <motion.li
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FaUtensilSpoon className="text-xl text-[#fff] mt-1" />
                <span>Expertly crafted meals with premium ingredients</span>
              </motion.li>
              <motion.li
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FaFireAlt className="text-xl text-[#fff] mt-1" />
                <span>Passion-driven cooking with flair and creativity</span>
              </motion.li>
              <motion.li
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <FaCheckCircle className="text-xl text-[#fff] mt-1" />
                <span>Strict quality control and consistent flavor every time</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServeFood;
