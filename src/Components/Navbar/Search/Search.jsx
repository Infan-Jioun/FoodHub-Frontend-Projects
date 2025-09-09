import { IoSearch, IoClose } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTypewriter } from "react-simple-typewriter";
import useRestaurantData from "../../Hooks/useRestaurantData";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [restaurantData] = useRestaurantData();

  // Typewriter placeholder
  const [text] = useTypewriter({
    words: [
      "Search your favorite restaurant...",
      "Pizza, Burger, Pasta...",
      "Find foods & categories...",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    if (!searchQuery) {
      setFilteredResults([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const results = [];

      restaurantData.forEach((restaurant) => {
        restaurant.foods?.forEach((food) => {
          const combinedString = [
            restaurant.restaurantName,
            restaurant.category,
          ]
            .join(" ")
            .toLowerCase();

          if (combinedString.includes(searchQuery.toLowerCase())) {
            results.push({
              restaurantId: restaurant._id,
              restaurantName: restaurant.restaurantName,
              restaurantCategory: restaurant.category,
              foodName: food.foodName,
              foodCategory: food.category,
            });
          }
        });
      });

      setFilteredResults(results);
      setLoading(false);
    }, 500);
  }, [searchQuery, restaurantData]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredResults([]);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 ">
      {/* Search Box */}
      <div className="flex shadow-xl rounded-full relative bg-white border-2 border-red-400">
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl text-red-500">
          <IoSearch />
        </div>
        <input
          type="text"
          placeholder={text}
          color="red"
          value={searchQuery}
          className="w-full p-4 bg-white pl-16 text-[15px] rounded-full font-semibold placeholder:text-red-500 text-red-500 
           focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      {/* Results */}
      {searchQuery && (
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <img
                src="https://i.ibb.co.com/F57mtch/logo2.png"
                alt="Loading Logo"
                className="w-20 h-20 object-contain animate-pulse"
              />
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              {/* Large Screen Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead className="bg-red-500 text-white">
                    <tr>
                      <th className="py-3 px-6 text-left">Restaurant Name</th>
                     
                      <th className="py-3 px-6 text-left">Food Name</th>
                      <th className="py-3 px-6 text-left">Food Category</th>
                      <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map(
                      (
                        {
                          restaurantId,
                          restaurantName,
                          restaurantCategory,
                          foodName,
                          foodCategory,
                        },
                        index
                      ) => (
                        <tr
                          key={`${restaurantId}-${index}`}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-6 text-red-600 font-semibold">
                            {restaurantName}
                          </td>
                      
                          <td className="py-4 px-6 text-gray-700">{foodName}</td>
                          <td className="py-4 px-6 text-gray-600">{foodCategory}</td>
                          <td className="py-4 px-6 text-center">
                            <Link to={`/restaurantUpload/${restaurantName}`}>
                              <button className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 transition">
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Small Screen Cards */}
              <div className="md:hidden grid gap-4">
                {filteredResults.map(
                  (
                    {
                      restaurantId,
                      restaurantName,
                      restaurantCategory,
                      foodName,
                      foodCategory,
                    },
                    index
                  ) => (
                    <div
                      key={`${restaurantId}-${index}`}
                      className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition"
                    >
                      <p className="text-red-600 font-bold text-lg">{restaurantName}</p>
                      <p className="text-gray-600">{restaurantCategory}</p>
                      <p className="text-gray-700 mt-1">{foodName}</p>
                      <p className="text-gray-500">{foodCategory}</p>
                      <Link to={`/restaurantUpload/${restaurantName}`} className="mt-3 block">
                        <button className="bg-red-500 text-white w-full py-2 rounded-full hover:bg-red-600 transition">
                          View
                        </button>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-xl text-gray-600 font-semibold mt-6">
              No restaurants found matching your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
