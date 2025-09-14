import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import RestaurantBanner1 from '../../../assets/RestaurantBanner/RestaurantBanner2.png';
import RestaurantBanner2 from '../../../assets/RestaurantBanner/RestaurantBanner3.png';
import RestaurantBanner3 from '../../../assets/RestaurantBanner/RestaurantBanner4.png';
import RestaurantBanner4 from '../../../assets/RestaurantBanner/RestaurantBanner2.png';
import RestaurantBanner5 from '../../../assets/RestaurantBanner/RestaurantBanner3.png';

const RestaurantBanner = () => {
  const [loadedImages, setLoadedImages] = useState({});

  const images = [RestaurantBanner1, RestaurantBanner2, RestaurantBanner3, RestaurantBanner4, RestaurantBanner5];

  return (
    <div className='relative'>
      <Swiper
        autoplay={{ delay: 1000 }}
        loop={true}

        className="mySwiper"
      >
        {images.map((imgSrc, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            {/* Skeleton */}
            {!loadedImages[index] && (
              <Skeleton
                height={400}
                width="100%"
                className="absolute top-0 left-0"
              />
            )}
            <img
              src={imgSrc}
              alt={`Slide ${index + 1}`}
              className={`w-full object-cover transition-opacity duration-500 ${loadedImages[index] ? "opacity-100" : "opacity-0"
                }`}
              onLoad={() =>
                setLoadedImages(prev => ({ ...prev, [index]: true }))
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RestaurantBanner;
