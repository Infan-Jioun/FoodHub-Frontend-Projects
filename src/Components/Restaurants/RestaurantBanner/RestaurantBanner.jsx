import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RestaurantBanner = () => {
  const [loadedImages, setLoadedImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef(null);
  const images = [
    {
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title: "Fine Dining Experience",
      subtitle: "Exquisite Cuisine & Ambiance"
    },
    {
      src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title: "Fresh Ingredients",
      subtitle: "Locally Sourced & Organic"
    },
    {
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title: "Elegant Atmosphere",
      subtitle: "Perfect for Every Occasion"
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };


  const BannerSkeleton = () => (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative bg-gradient-to-r from-gray-200 to-gray-300 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading delicious moments...</p>
        </div>
      </div>
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
    </div>
  );

  if (isLoading) {
    return <BannerSkeleton />;
  }

  return (
    <div className="relative group  overflow-hidden bg-white mx-auto w-full">
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return `<span class="${className} !w-2 !h-2 md:!w-3 md:!h-3 !bg-white/80 !opacity-60 hover:!opacity-100 transition-all duration-300 !mx-1"></span>`;
          },
        }}
        navigation={{
          nextEl: '.banner-next',
          prevEl: '.banner-prev',
        }}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
        loop={true}
        speed={1000}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {!loadedImages[index] && (
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full">
                <Skeleton
                  height="100%"
                  width="100%"
                  baseColor="#f8fafc"
                  highlightColor="#f1f5f9"
                  className="rounded-none"
                  enableAnimation={true}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-24 h-3 sm:w-28 sm:h-3 md:w-32 md:h-4 bg-white/80 rounded-full mx-auto" />
                    <div className="w-20 h-2 sm:w-22 sm:h-2 md:w-24 md:h-3 bg-white/60 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            )}
            <div className="relative w-full h-full">
              <img
                src={image.src}
                alt={image.title}
                className={`w-full h-full object-cover transition-all duration-1000 ${loadedImages[index]
                  ? "opacity-100 scale-100 blur-0"
                  : "opacity-0 scale-110 blur-sm"
                  }`}
                onLoad={() => handleImageLoad(index)}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 text-white transition-all duration-700 delay-300 ${loadedImages[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                <div className="max-w-4xl mx-auto w-full">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 font-serif leading-tight">
                    {image.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-3 sm:mb-4 md:mb-6 font-light leading-relaxed">
                    {image.subtitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm z-20">
              {index + 1} / {images.length}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="banner-prev absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:scale-110">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button className="banner-next absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:scale-110">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default RestaurantBanner;