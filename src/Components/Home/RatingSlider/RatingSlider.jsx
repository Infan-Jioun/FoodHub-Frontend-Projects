import { Swiper, SwiperSlide } from 'swiper/react';
import { FaStar } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const people = [
  {
    name: "Rahim Uddin",
    comment: "Loved the biryani! Will order again.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Jake Patel",
    comment: "Could improve packaging but food was excellent.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Thomas Lee",
    comment: "Customer service was very helpful.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    name: "David Kim",
    comment: "Nice user experience on the app.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    name: "Rohan Singh",
    comment: "I wish the drinks came colder, but still a great meal.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    name: "Ahmed Khan",
    comment: "Tandoori chicken was mouth-watering!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    name: "John Doe",
    comment: "Delivery was right on time and hassle-free.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    name: "Imran Sheikh",
    comment: "Great portions and flavors!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    name: "Hasan Chowdhury",
    comment: "Food was hot and fresh as always.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    name: "Omar Faruq",
    comment: "Superb service and taste.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/20.jpg",
  },
];

const RatingSlider = () => {
  return (
    <div className="bg-white py-12 px-4 md:px-20">
      <h2 className="text-3xl font-bold font-Caveat text-center text-red-600 mb-10">
        What Our Customers Say
      </h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        modules={[Pagination, Autoplay]}
      >
        {people.map((person, index) => (
          <SwiperSlide key={index}>
            <div className="bg-red-50 p-6 rounded-xl shadow hover:shadow-lg transition duration-300 h-full flex flex-col justify-between">
              <div className="flex flex-col items-center text-center">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-red-500"
                />
                <p className="text-gray-800 mb-3 text-sm">"{person.comment}"</p>
                <div className="flex items-center justify-center text-[#ff0000d8] mb-2">
                  {Array.from({ length: person.rating }, (_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="font-semibold text-gray-700 mt-2">{person.name}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RatingSlider;
