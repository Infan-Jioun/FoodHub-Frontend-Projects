
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const items = [
  { name: "Biryani", path: "/biryani", img: "https://i.ibb.co/Hgq3rf9/biryani.png" },
  { name: "Pizza", path: "/pizza", img: "https://i.ibb.co/PFBV4qh/pizza.png" },
  { name: "Burger", path: "/burger", img: "https://i.ibb.co/yy1Jc6N/burger-removebg-preview.png" },
  { name: "Chicken", path: "/chicken", img: "https://i.ibb.co/FJg7xmP/Chicken.png" },
  { name: "Chinese", path: "/chinese", img: "https://i.ibb.co/jLzCxbQ/Chinese.png" },
  { name: "Cake", path: "/cake", img: "https://i.ibb.co/12qMjL0/Cake.png" },
  { name: "Beef", path: "/beef", img: "https://i.ibb.co/wMjCr5Q/beep.png" },
  { name: "Juice", path: "/juice", img: "https://i.ibb.co/LRQjdvF/drinks.png" },
  { name: "Coffee", path: "/coffee", img: "https://i.ibb.co/XkLP2ctZ/coffee-2.png" },
];

const AvailableItem = () => {
  const [loadedImages, setLoadedImages] = useState({});

  return (
    <div className="mt-20 mb-8">
      <Marquee pauseOnHover={true} speed={40} gradient={false}>
        <div className="flex gap-20 px-4">
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
                  className={`w-28 h-28 object-contain rounded-xl shadow-md transition-opacity duration-500 ${
                    loadedImages[index] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setLoadedImages(prev => ({ ...prev, [index]: true }))}
                />
                <p className="mt-2 font-Caveat font-extrabold text-red-500 text-center">
                  {item.name}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default AvailableItem;
