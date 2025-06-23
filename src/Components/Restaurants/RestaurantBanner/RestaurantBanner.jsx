import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

import RestaurantBanner2 from '../../../assets/RestaurantBanner/RestaurantBanner2.png';
import RestaurantBanner3 from '../../../assets/RestaurantBanner/RestaurantBanner3.png';
import RestaurantBanner4 from '../../../assets/RestaurantBanner/RestaurantBanner4.png';

const RestaurantBanner = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}

        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <img
            src={RestaurantBanner2}
            alt="Restaurant Banner 1"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={RestaurantBanner3}
            alt="Restaurant Banner 2"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={RestaurantBanner4}
            alt="Restaurant Banner 3"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default RestaurantBanner;
