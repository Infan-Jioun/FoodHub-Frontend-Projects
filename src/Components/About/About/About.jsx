
import { FaUtensils, FaBullseye, FaHistory, FaThumbsUp, FaUserTie, FaGlobe, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Typography } from "@material-tailwind/react";
import { Helmet } from "react-helmet";

const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const imageAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const [loadedImg, setLoadedImg] = useState({});

  const handleImgLoad = (key) => {
    setLoadedImg((prev) => ({ ...prev, [key]: true }));
  };
  const accounts = [
    { role: "Admin", email: "foodhub@admin.com", pass: "12345678" },
    { role: "Moderator", email: "foodhub@moderator.com", pass: "12345678" },
    { role: "Restaurant", email: "7dayz@restaurant.com", pass: "12345678" },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-12 px-4 md:px-20 text-gray-800 font-Kanit">
      {/* Header */}
      <Helmet>

      </Helmet>
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"

        variants={fadeUp}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to <span className="text-[#ff1818]">Foodhub</span>
        </h1>
        <p className="text-lg text-gray-600">
          Delivering joy, one meal at a time.
        </p>
      </motion.div>

      <div className="space-y-20">
        {/* What is Foodhub */}
        <motion.section
          className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 hover:shadow-2xl transition"
          initial="hidden"
          whileInView="visible"

          variants={fadeUp}
        >
          {!loadedImg.foodhub && <Skeleton height={400} className="rounded-xl" />}
          <motion.img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800"
            alt="Foodhub"
            className={`rounded-xl shadow-lg object-cover transition-opacity duration-500 ${loadedImg.foodhub ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => handleImgLoad("foodhub")}
            variants={imageAnim}
          />
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FaUtensils className="text-[#ff1818] text-2xl" />
              <h2 className="text-2xl font-semibold">What is Foodhub?</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Foodhub is a modern restaurant delivery platform that connects
              local restaurants and customers. Browse, order, and enjoy meals
              from your favorite places — all from the comfort of your home.
            </p>
          </div>
        </motion.section>

        {/* Mission */}
        <motion.section
          className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 hover:shadow-2xl transition"
          initial="hidden"
          whileInView="visible"

          variants={fadeUp}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FaBullseye className="text-[#ff1818] text-2xl" />
              <h2 className="text-2xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              Our mission is to empower local restaurants and simplify food ordering for everyone. Whether traditional or trending cuisines, Foodhub brings the best food to your doorstep — fast, fresh, and reliable.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              We are committed to supporting local businesses, providing a seamless ordering experience, and ensuring that every meal delivered maintains the highest quality standards.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              By embracing technology and innovation, Foodhub aims to make food delivery convenient, enjoyable, and accessible to everyone, anytime and anywhere.
            </p>
          </div>
          {!loadedImg.mission && <Skeleton height={400} className="rounded-xl w-full" />}
          <motion.img
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800"
            alt="Mission"
            className={`rounded-xl shadow-lg object-cover w-full h-80 md:h-[28rem] transition-opacity duration-500 ${loadedImg.mission ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => handleImgLoad("mission")}
            variants={imageAnim}
          />
        </motion.section>

        {/* Journey */}
        <motion.section
          className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 hover:shadow-2xl transition"
          initial="hidden"
          whileInView="visible"

          variants={fadeUp}
        >
          {!loadedImg.journey && <Skeleton height={400} className="rounded-xl w-full" />}
          <motion.img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
            alt="Journey"
            className={`rounded-xl shadow-lg object-cover w-full h-80 md:h-[28rem] transition-opacity duration-500 ${loadedImg.journey ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => handleImgLoad("journey")}
            variants={imageAnim}
          />
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FaHistory className="text-[#ff1818] text-2xl" />
              <h2 className="text-2xl font-semibold">Our Journey</h2>
            </div>
            <p className="text-lg leading-relaxed">
              Launched in 2025 by food and tech enthusiasts, Foodhub began with a simple idea: make great food more accessible. Today, we serve thousands of happy customers and partner with diverse restaurants.
            </p>
            <p className="text-lg leading-relaxed">
              Over the years, we have expanded our network, introduced faster delivery options, and incorporated cutting-edge technology to ensure that every order reaches our customers fresh and on time.
            </p>
            <p className="text-lg leading-relaxed">
              Our journey is driven by a passion for connecting people with delicious meals and supporting local businesses. With every milestone, we aim to redefine convenience and delight in food delivery.
            </p>
          </div>
        </motion.section>

        {/* Why Choose */}
        <section className="container mx-auto px-4 py-10 space-y-10">
          {/* Logo and tagline */}
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"

            variants={fadeUp}
          >
            <img
              src="https://i.ibb.co/F57mtch/logo2.png"
              alt="Logo"
              className="w-20 h-20 mx-auto mb-4"
            />
            <Typography variant="lead" className="text-gray-700 mb-4">
              Discover food, restaurants & seamless delivery
            </Typography>
          </motion.div>

          {/* Account cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"

            variants={fadeUp}
          >
            {accounts.map((acc) => (
              <motion.div
                key={acc.role}
                className="bg-red-50 rounded-lg p-6 text-center shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
              >
                <Typography variant="h6" className="text-[#ff1818] mb-2">
                  {acc.role}
                </Typography>
                <Typography className="text-sm">
                  Email: {acc.email} | Pass: {acc.pass}
                </Typography>
              </motion.div>
            ))}
          </motion.div>

          {/* Why Choose section */}
          <motion.section
            className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 hover:shadow-2xl transition"
            initial="hidden"
            whileInView="visible"

            variants={fadeUp}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FaThumbsUp className="text-[#ff1818] text-2xl" />
                <h2 className="text-2xl font-semibold">Why Choose Foodhub?</h2>
              </div>
              <ul className="list-disc list-inside text-lg space-y-2">
                <li>Fast and secure ordering process</li>
                <li>Wide variety of restaurants and cuisines</li>
                <li>Real-time order tracking</li>
                <li>Secure payments (Stripe & SSLCommerz)</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
            <div>
              <img
                src="https://i.ibb.co/F57mtch/logo2.png"
                alt="Foodhub Illustration"
                className="w-full h-auto "
              />
            </div>
          </motion.section>
        </section>

        {/* Developer Info */}
        <motion.section
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-orange-400" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603415526960-f8f1e8f1c0a6?w=1200')] bg-cover bg-center opacity-10" />

          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-orange-300/20 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-8 md:p-14">

            {/* Avatar */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-white/30 blur-md scale-110" />
                {!loadedImg.dev && (
                  <Skeleton circle height={176} width={176} />
                )}
                <motion.img
                  src="https://i.ibb.co.com/Kc7F21y5/professional-photo.png"
                  alt="Developer"
                  onLoad={() => handleImgLoad("dev")}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-2xl transition-opacity duration-500 ${loadedImg.dev ? "opacity-100" : "opacity-0 absolute"
                    }`}
                />
              </div>
              {/* Badge */}
              <span className="mt-2 px-4 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold tracking-wide text-white">
                Full-Stack Developer
              </span>
            </div>

            {/* Divider - desktop only */}
            <div className="hidden md:block w-px self-stretch bg-white/20" />

            {/* Info */}
            <div className="flex-1 space-y-6 text-white">
              {/* Title */}
              <div>
                <p className="text-sm uppercase tracking-widest text-white/60 mb-1 flex items-center gap-2">
                  <FaUserTie /> Developer Info
                </p>
                <h2 className="text-3xl md:text-4xl font-bold">Infan Jioun Rahman</h2>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-start gap-3 bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Email</p>

                <a href="mailto:infanjiounrahman20606@gmail.com"
                    className="text-sm font-medium hover:text-orange-200 transition-colors break-all"
            >
                    infanjiounrahman20606@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaPhone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Phone</p>

                <a href="tel:01610240096"
                  className="text-sm font-medium hover:text-orange-200 transition-colors"
            >
                  01610240096
                </a>
              </div>
            </div>

            {/* Portfolio */}
            <div className="flex items-start gap-3 bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:col-span-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaGlobe className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Portfolio</p>

               <a href="https://infan-jioun.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium hover:text-orange-200 transition-colors"
            >
                infan-jioun.vercel.app ↗
              </a>
            </div>
          </div>
      </div>
    </div>
  </div >
</motion.section >
      </div >

  {/* Thank You */ }
  < motion.section
className = "text-center mt-16"
initial = "hidden"
whileInView = "visible"

variants = { fadeUp }
  >
  <p className="text-lg font-medium text-gray-700">
    Thank you for choosing{" "}
    <span className="text-[#ff1818] font-bold">Foodhub</span> — where your
    next favorite meal is just a click away!
  </p>
      </motion.section >
    </div >
  );
};

export default About;
