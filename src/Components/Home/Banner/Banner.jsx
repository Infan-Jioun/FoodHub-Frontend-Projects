import { useState, useCallback, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";
import { Link } from "react-router-dom";
const preloadImages = (urls) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

const Banner = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Memoized slide data
  const slides = [
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
  ];

  const cornerImages = [
    {
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      className: "top-2 left-2 w-10 sm:top-4 sm:left-4 sm:w-16 md:top-6 md:left-6 md:w-24",
      animation: { x: [-80, 0], opacity: [0, 1] },
    },
    {
      src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      className: "top-2 right-2 w-10 sm:top-4 sm:right-4 sm:w-16 md:top-6 md:right-6 md:w-24",
      animation: { x: [80, 0], opacity: [0, 1] },
    },
    {
      src: "https://i.ibb.co/0j6vbL9M/the-design-lady-jb-Cs-IV-XK4-unsplash.jpg",
      className: "bottom-2 left-2 w-10 sm:bottom-4 sm:left-4 sm:w-16 md:bottom-6 md:left-6 md:w-24",
      animation: { y: [80, 0], opacity: [0, 1] },
    },
    {
      src: "https://i.ibb.co/4H336w4/ivan-torres-MQUqbmsz-GGM-unsplash.jpg",
      className: "bottom-2 right-2 w-10 sm:bottom-4 sm:right-4 sm:w-16 md:bottom-6 md:right-6 md:w-24",
      animation: { y: [80, 0], opacity: [0, 1] },
    },
  ];

  // Preload images on component mount
  useState(() => {
    const allImages = [...slides, ...cornerImages.map(img => img.src)];
    preloadImages(allImages);
  });

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    setCurrentSlide(swiper.realIndex);
  }, []);

  // Optimized corner image component
  const CornerImage = memo(({ img, index }) => (
    <motion.img
      key={index}
      src={img.src}
      alt={`corner-${index}`}
      className={`absolute rounded-lg shadow-lg ${img.className}`}
      initial={img.animation}
      animate={{ x: 0, y: 0, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 3 }}
      transition={{
        duration: 1,
        delay: index * 0.3,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
      loading="lazy"
      decoding="async"
    />
  ));

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative w-full">
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000, 
            disableOnInteraction: false
          }}
          loop={true}
          speed={800} 
          className="h-full"
          onSlideChange={handleSlideChange}
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="w-full relative h-96 sm:h-[60vh] md:h-[90vh]">
                {!imageLoaded && idx === currentSlide && (
                  <Skeleton
                    className="w-full h-full"
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                )}

                <motion.img
                  src={slide}
                  alt={`slide-${idx}`}
                  className="w-full h-full object-cover absolute top-0 left-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: (imageLoaded && idx === currentSlide) ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  onLoad={idx === 0 ? handleImageLoad : undefined}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />

                <motion.div
                  className="absolute inset-0 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.8 }}
                />

                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4"
                  >
                    Delicious Food Awaits
                  </motion.h1>

                  <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-sm sm:text-lg md:text-2xl max-w-xs sm:max-w-xl md:max-w-2xl mb-6"
                  >
                    Fresh, tasty, and delivered fast at your doorstep!
                  </motion.p>

                  <Link to={"/restaurants"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-[#ff1818] hover:bg-[#ff1818] rounded-full font-semibold text-sm sm:text-lg shadow-lg"
                    >
                      Order Now
                    </motion.button>
                  </Link>
                </motion.div>

                {cornerImages.map((img, i) => (
                  <CornerImage key={i} img={img} index={i} />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </LazyMotion>
  );
};

export default memo(Banner);