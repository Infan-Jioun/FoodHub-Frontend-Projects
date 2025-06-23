import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Banner = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <img
            src="https://i.ibb.co/xjTbNcp/home2.png"
            alt="Banner 1"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://i.ibb.co/MCd7jXg/HOME1.png"
            alt="Banner 2"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://i.ibb.co/XWzByRJ/home4.png"
            alt="Banner 3"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
