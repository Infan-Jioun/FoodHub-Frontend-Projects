import { FaUtensilSpoon, FaFireAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const ServeFood = () => {
  return (
    <div className="mt-5">
      <div
        className="hero  h-[500px] bg-fixed  bg-cover bg-center"
        style={{
          backgroundImage: "url(https://i.ibb.co.com/zRQk4Bw/chef-service.jpg)",
        }}
      >
        <div className="hero-overlay bg-black bg-opacity-50"></div>
        <div className="hero-content text-neutral-content text-center rounded-2xl px-4">
          <motion.div
            className="w-full max-w-[400px] md:max-w-3xl rounded-3xl bg-[#ff0000d8] p-6 md:p-10"
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
