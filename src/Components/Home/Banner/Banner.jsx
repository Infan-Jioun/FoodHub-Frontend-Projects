
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Banner = () => {

  const [loadedImages, setLoadedImages] = useState({});

  const images = [
    'https://i.ibb.co.com/xjTbNcp/home2.png',
    'https://i.ibb.co.com/MCd7jXg/HOME1.png',
    'https://i.ibb.co.com/XWzByRJ/home4.png',
  ];

  return (
    <div className='relative w-full h-[400px] md:h-[500px] lg:h-[600px]'>
      <Swiper
        autoplay={{ delay: 3000 }}
        loop={true}
        className="mySwiper h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center h-full">
            {!loadedImages[index] && (
              <Skeleton 
                height="100%" 
                width="100%" 
                className="absolute top-0 left-0"
              />
            )}
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                loadedImages[index] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() =>
                setLoadedImages((prev) => ({ ...prev, [index]: true }))
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
