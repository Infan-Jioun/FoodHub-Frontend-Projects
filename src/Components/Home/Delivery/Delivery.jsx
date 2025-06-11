import { motion } from "framer-motion";
import { FaTruck, FaClock, FaSmileBeam } from "react-icons/fa";

const Delivery = () => {
  return (
    <motion.div
      className=" bg-red-50 md:h-[500px]  space-x-4 mb-4 py-12 px-4 md:px-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-red-600 font-Caveat mb-6">Fast & Fresh Delivery</h2>
        <p className="text-lg text-gray-700 mb-10">
          We bring your favorite meals right to your door – hot, fresh, and fast!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaTruck />,
              title: "Speedy Delivery",
              desc: "Our couriers are trained to deliver in record time, safely and reliably.",
            },
            {
              icon: <FaClock />,
              title: "Real-Time Tracking",
              desc: "Track your order from kitchen to doorstep with live updates.",
            },
            {
              icon: <FaSmileBeam />,
              title: "Customer Happiness",
              desc: "We prioritize your satisfaction with 24/7 delivery support.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="text-4xl text-[#ff0000d8] mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Delivery;
