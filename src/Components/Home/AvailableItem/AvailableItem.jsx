import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const items = [
  { 
    name: "Biryani", 
    path: "/biryani", 
    img: "https://i.ibb.co.com/3mnnsnkR/A-luxurious-plate-of-steaming-hot-Hyderabadi-biryani-served-in-a-golden-bowl-garnished-with-saffron.jpg" 
  },
  { 
    name: "Pizza", 
    path: "/pizza", 
    img: "https://i.ibb.co.com/7JH1fCgR/A-freshly-baked-wood-fired-pizza-topped-with-melted-mozzarella-cheese-pepperoni-basil-leaves-and-dri.jpg" 
  },
  { 
    name: "Burger", 
    path: "/burger", 
    img: "https://i.ibb.co.com/hRDf0D8N/A-giant-juicy-beef-burger-with-layers-of-cheddar-cheese-lettuce-tomato-caramelized-onions-and-crispy.jpg" 
  },
  { 
    name: "Chicken", 
    path: "/chicken", 
    img: "https://i.ibb.co.com/mCk64CKp/Perfectly-roasted-whole-chicken-with-golden-crispy-skin-garnished-with-rosemary-and-lemon-slices-Ser.jpg" 
  },
  { 
    name: "Chinese", 
    path: "/chinese", 
    img: "https://i.ibb.co.com/Z1L8x4Cv/A-colorful-spread-of-authentic-Chinese-cuisine-featuring-dumplings-noodles-stir-fried-vegetables-and.jpg" 
  },
  { 
    name: "Cake", 
    path: "/cake", 
    img: "https://i.ibb.co.com/Z7m5Js1/A-luxurious-chocolate-drip-cake-decorated-with-strawberries-blueberries-and-edible-gold-flakes-The-c.jpg" 
  },
  { 
    name: "Beef", 
    path: "/beef", 
    img: "https://i.ibb.co.com/gZXSBtWs/A-perfectly-grilled-steak-with-medium-rare-pink-center-garnished-with-garlic-butter-and-rosemary-Ser.jpg" 
  },
  { 
    name: "Juice", 
    path: "/juice", 
    img: "https://i.ibb.co.com/fzrDfty1/A-refreshing-glass-of-tropical-juice-blend-orange-mango-pineapple-with-ice-cubes-mint-leaves-and-con.jpg" 
  },
  { 
    name: "Coffee", 
    path: "/coffee", 
    img: "https://i.ibb.co.com/93Wps5RS/A-steaming-hot-cup-of-cappuccino-with-perfect-latte-art-in-a-rustic-ceramic-cup-Placed-on-a-wooden-c.jpg" 
  },
];

// ✅ আলাদা card component — প্রতিটা item এর নিজস্ব loaded state
const FoodCard = ({ item }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link to={item.path} className="inline-block mx-8">
      <motion.div
        className="flex flex-col items-center w-32 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* ✅ wrapper div — skeleton আর image একই জায়গায় */}
        <div className="w-28 h-28 relative">
          {/* Skeleton — image load না হওয়া পর্যন্ত */}
          {!loaded && (
            <Skeleton
              circle
              width={112}
              height={112}
              baseColor="#ffe5e5"
              highlightColor="#ffcccc"
              className="absolute inset-0"
            />
          )}

          {/* Image — সবসময় render, loaded হলে দেখাবে */}
          <img
            src={item.img}
            alt={item.name}
            onLoad={() => setLoaded(true)}
            className={`
              w-28 h-28 object-cover rounded-full shadow-md
              transition-opacity duration-500
              ${loaded ? "opacity-100" : "opacity-0"}
            `}
          />
        </div>

        {/* Name — skeleton থাকলে placeholder */}
        {loaded ? (
          <p className="mt-3 font-semibold text-center text-[#ff1818] text-sm">
            {item.name}
          </p>
        ) : (
          <Skeleton
            width={72}
            height={14}
            className="mt-3"
            baseColor="#ffe5e5"
            highlightColor="#ffcccc"
          />
        )}
      </motion.div>
    </Link>
  );
};

const AvailableItem = () => {
  return (
    <div className="mt-16 mb-16 px-1">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-Caveat text-[#ff1818]">Available Foods</h2>
        <p className="text-gray-500 mt-2">Explore our delicious menu items below</p>
      </div>

      <Marquee pauseOnHover speed={40} gradient={false}>
        {items.map((item, index) => (
          <FoodCard key={index} item={item} />
        ))}
      </Marquee>
    </div>
  );
};

export default AvailableItem;