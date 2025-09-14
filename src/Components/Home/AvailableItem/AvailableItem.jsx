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

const AvailableItem = () => {
  const [loadedImages, setLoadedImages] = useState({});

  return (
    <div className="mt-16 mb-16 px-4">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-Caveat text-[#ff1818]">Available Foods</h2>
        <p className="text-gray-500 mt-2">Explore our delicious menu items below</p>
      </div>

      <Marquee pauseOnHover={true} speed={40} gradient={false}>
        <div className="flex gap-16">
          {items.map((item, index) => (
            <Link to={item.path} key={index} className="inline-block">
              <motion.div
                className="flex flex-col items-center w-32 cursor-pointer relative"
                whileHover={{ scale: 1.1, rotateX: 5, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {!loadedImages[index] && (
                  <Skeleton 
                    height={112} 
                    width={112} 
                    className="absolute top-0 left-0"
                    borderRadius="12px"
                  />
                )}
                <img
                  src={item.img}
                  alt={item.name}
                  className={`w-28 h-28 object-contain rounded-full shadow-md transition-opacity duration-500 ${
                    loadedImages[index] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setLoadedImages(prev => ({ ...prev, [index]: true }))}
                />
                <p className="mt-2 font-semibold text-center text-[#ff1818]">{item.name}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default AvailableItem;
