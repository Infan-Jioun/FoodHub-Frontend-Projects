import {
  FaUtensils,
  FaBullseye,
  FaHistory,
  FaThumbsUp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const About = () => {
  const red = "#ff0000d8";

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-20 text-gray-800 font-Kanit">
    
      <div className="text-center mb-12">
        
        <p className="text-lg text-gray-600">Delivering joy, one meal at a time.</p>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-3 text-xl font-semibold text-gray-800">
          <FaUtensils style={{ color: red }} /> <h2>What is Foodhub?</h2>
        </div>
        <p className="text-lg leading-relaxed">
          Foodhub is a modern restaurant delivery platform that bridges the gap
          between local restaurants and customers. We make it easy for users to
          browse, order, and enjoy their favorite meals from nearby eateries — all
          from the comfort of their home.
        </p>
      </section>

      <hr className="border-t border-gray-200 my-8" />

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-3 text-xl font-semibold text-gray-800">
          <FaBullseye style={{ color: red }} /> <h2>Our Mission</h2>
        </div>
        <p className="text-lg leading-relaxed">
          Our mission is to empower local restaurants and simplify food ordering
          for everyone. Whether you’re craving traditional dishes or trending
          cuisines, Foodhub brings the best food to your doorstep — fast, fresh,
          and reliable.
        </p>
      </section>

      <hr className="border-t border-gray-200 my-8" />

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-3 text-xl font-semibold text-gray-800">
          <FaHistory style={{ color: red }} /> <h2>Our Journey</h2>
        </div>
        <p className="text-lg leading-relaxed">
          Launched in 2024 by a group of passionate food and tech enthusiasts,
          Foodhub started with a simple idea: to make great food more accessible.
          Since then, we’ve grown into a trusted platform serving thousands of
          happy customers and partnering with a wide range of restaurants.
        </p>
      </section>

      <hr className="border-t border-gray-200 my-8" />

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-3 text-xl font-semibold text-gray-800">
          <FaThumbsUp style={{ color: red }} /> <h2>Why Choose Foodhub?</h2>
        </div>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Fast and secure ordering process</li>
          <li>Wide variety of restaurants and cuisines</li>
          <li>Real-time order tracking</li>
          <li>Secure payment with Stripe & SSLCommerz</li>
          <li>24/7 customer support</li>
        </ul>
      </section>

      <hr className="border-t border-gray-200 my-8" />

   
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaEnvelope style={{ color: red }} /> Contact Us
        </h2>
        <p className="text-lg mb-2">
          Have questions, feedback, or partnership inquiries? We’d love to hear from you!
        </p>
        <div className="space-y-2 text-lg">
          <p className="flex items-center gap-2">
            <FaEnvelope style={{ color: red }} />{" "}
            <a href="mailto:support@foodhub.com" className="text-red-600 hover:underline">
              support@foodhub.com
            </a>
          </p>
          <p className="flex items-center gap-2">
            <FaPhoneAlt style={{ color: red }} />{" "}
            <a href="tel:+0161040096" className="text-red-600 hover:underline">
              +01610 (240) 096
            </a>
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt style={{ color: red }} /> 123 Main Street, Food City, FC 10001
          </p>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-8" />

      
      <section className="text-center mt-10">
        <p className="text-lg font-medium text-gray-700">
          Thank you for choosing{" "}
          <span className="text-red-600 font-bold">Foodhub</span> — where your next
          favorite meal is just a click away!
        </p>
      </section>
    </div>
  );
};

export default About;
