import { IoSearch } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useRestaurantData from "../../Hooks/useRestaurantData";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [restaurantData] = useRestaurantData();

  useEffect(() => {
    if (!searchQuery) {
      setFilteredResults([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Flatten all restaurant-food pairs that match the search query
      const results = [];

      restaurantData.forEach((restaurant) => {
        restaurant.foods?.forEach((food) => {
          const combinedString = [
            restaurant.restaurantName,
            restaurant.category,
            // food.foodName,
            // food.category,
            // restaurant.districtName,
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

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Search Box */}
      <div className="flex shadow-lg rounded-full relative">
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl text-red-500">
          <IoSearch />
        </div>
        <input
          type="text"
          placeholder="Search for foods, restaurants or categories..."
          className="w-full p-3 pl-16 text-[13px] rounded-full border-2 bg-white border-red-400 focus:outline-none font-semibold"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Results */}
      {searchQuery && (
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <img
                src="https://i.ibb.co.com/F57mtch/logo2.png"
                alt="Loading Logo"
                className="w-28 h-28 object-contain animate-pulse"
              />
            </div>
          ) : filteredResults.length > 0 ? (
            <ul className="space-y-4">
              {filteredResults.map(
                (
                  { restaurantId, restaurantName, restaurantCategory, foodName, foodCategory },
                  index
                ) => (
                  <li
                    key={`${restaurantId}-${index}`}
                    className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <div>
                      <p className="text-lg font-semibold text-red-600">{restaurantName}</p>
                     
                    </div>
                    <Link to={`/restaurantUpload/${restaurantName}`}>
                      <button className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 transition">
                        View Details
                      </button>
                    </Link>
                  </li>
                )
              )}
            </ul>
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
