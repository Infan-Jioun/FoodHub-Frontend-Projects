
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BannerFour = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div>
      <p className='text-center font-bold text-xl text-[#ff1818] font-Caveat'>
        You prepare the food, we handle the rest
      </p>
      <div className="relative w-full mt-5 mb-24 h-[440px]">
        {/* Skeleton for loading */}
        {!loaded && (
          <Skeleton 
            height="100%" 
            width="100%" 
            className="absolute top-0 left-0"
          />
        )}

        {/* Background Image */}
        <img
          src="https://i.ibb.co/xKqhCHzc/home-vendor-pk.webp"
          alt="Restaurant Banner"
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />

        {/* Text Overlay */}
        <div className='px-2'>
          <div data-aos="fade-right" className="absolute top-1/2 bg-red-50 mt-16 left-0 lg:left-40 px-6 ml-2 p-6 rounded-2xl shadow-xl max-w-lg">
            <h2 className="text-[15px] lg:text-xl font-bold text-[#ff1818]">
              List your restaurant or shop on FoodHub
            </h2>
            <p className="text-gray-700 mt-2">
              Would you like millions of new customers <br />to enjoy your amazing food and groceries?<br />
              We list your menu online, process orders,<br /> and deliver them in no time!
            </p>
            <Link to={"/restaurantRegister"}>
              <button className="mt-4 bg-[#ff1818] text-white px-5 py-2 rounded-full hover:bg-[#ff1818] transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerFour;
