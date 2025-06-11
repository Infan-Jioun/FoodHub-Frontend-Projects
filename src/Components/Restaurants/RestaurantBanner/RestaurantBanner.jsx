
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import RestaurantBanner1 from '../../../assets/RestaurantBanner/RestaurantBanner2.png'
import RestaurantBanner2 from '../../../assets/RestaurantBanner/RestaurantBanner3.png'
import RestaurantBanner3 from '../../../assets/RestaurantBanner/RestaurantBanner4.png'
import RestaurantBanner4 from '../../../assets/RestaurantBanner/RestaurantBanner2.png'
import RestaurantBanner5 from '../../../assets/RestaurantBanner/RestaurantBanner3.png'
// import RestaurantBanner4 from '../../../assets/RestaurantBanner/RestaurantBanner4.png'

const RestaurantBanner = () => {
    return (
        <div className='relative'>
            <Swiper
                pagination={{
                    dynamicBullets: true,

                }}

              
                className="mySwiper  "
            >
              
                <SwiperSlide>

                    <div className=' '>
                        <img src={RestaurantBanner2} alt="" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>

                    <div className=' '>
                        <img src={RestaurantBanner3} alt="" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>

                    <div className=' '>
                        <img src={RestaurantBanner4} alt="" />
                    </div>
                </SwiperSlide>

            </Swiper>
        </div>
    );
};

export default RestaurantBanner;

