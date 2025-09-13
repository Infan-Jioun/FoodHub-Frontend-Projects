
import { useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BannerTwo = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-5">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 px-4 justify-center items-center md:gap-3 lg:gap-6 md:px-10 lg:px-16">
        <div className="sm:px-4 relative">
          {!loaded && (
            <Skeleton
              height={400}
              width="100%"
              className="absolute top-0 left-0"
            />
          )}
          <img
            src="https://i.ibb.co.com/VJTbsNp/welcome-bg-png.webp"
            alt="Welcome"
            className={`w-full object-cover transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
          />
        </div>
        <div>
          <div className="md:w-80 lg:w-96">
            <p className="md:text-sm lg:text-[16px] md:mt-10">
              Created god gathered don't you yielding herb you had. And isn't,
              god was saw. Dominion. Great sixth for in unto was. Open can't
              tree am waters brought. Divide after there.
            </p>
            <br />
            <p className="md:text-sm lg:text-[16px]">
              Created god gathered don't you yielding herb you had. And isn't,
              god was saw. Dominion. Great sixth for in unto was. Open can't
              tree waters brought. Divide after there. Was. Created god gathered
              don't you yielding herb you had. And isn't god.
            </p>
            <div className="w-60">
              <Link to="https://foodhub-d3e1e.web.app/restaurantUpload/7dayz">
                <button className="rounded mt-5 border-2 p-3 px-3 border-[#ff1818] bg-[#ff1818] text-white font-semibold hover:transition-colors hover:bg-white hover:text-[#ff1818]">
                  BOOK A FOOD
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTwo;
