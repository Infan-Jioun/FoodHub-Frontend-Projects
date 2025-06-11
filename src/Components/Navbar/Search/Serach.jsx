import { IoSearch } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useRestaurantData from "../../Hooks/useRestaurantData";
import { Circles } from "react-loader-spinner";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [restaurantData] = useRestaurantData();

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRestaurants([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const results = restaurantData.filter((restaurant) =>
        Object.values({
          restaurantName: restaurant.restaurantName,
          districtName: restaurant.districtName,
          resataurantCategory: restaurant.resataurantCategory,
          category: restaurant.category,
          foods: restaurant.foods?.map((food) => food.foodName).join(", ") || "",
        })
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setFilteredRestaurants(results);
      setLoading(false);
    }, 500);
  }, [searchQuery, restaurantData]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-3 text-xl font-Caveat">
      {/* Search Input */}
      <div className="flex mt-16 shadow-2xl rounded-lg relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold">
          <IoSearch />
        </div>
        <input
          type="text"
          placeholder="Search for a restaurant ..."
          className="w-full p-2 pl-14 font-bold rounded-full border-2 font-Caveat border-red-500 focus:outline-none"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display Loading or Results */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-7 mt-5">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Circles height="90" width="90" color="#ff0000d8" ariaLabel="loading" />
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="overflow-x-auto mt-5">
              <table className="table w-full border-collapse border border-gray-300">
                {/* Table Header */}
               

                {/* Table Body */}
                <tbody>
                  {filteredRestaurants.flatMap((restaurant) =>
                    restaurant.foods?.map((food, index) => (
                      <tr key={`${restaurant._id}-${index}`} className="border border-gray-300">
                        {/* Checkbox */}
                           

                        {/* Food Image & Name */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src={food.foodImage} alt={food.foodName} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{food.foodName}</div>
                              <div className="text-sm opacity-50">{food.category}</div>
                            </div>
                          </div>
                        </td>

                        {/* Restaurant Name & Banner */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src={restaurant.photo || restaurant.banner} alt={restaurant.restaurantName} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{restaurant.restaurantName}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                      

                       

                        {/* Actions */}
                        <td>
                          <Link to={`/restaurantUpload/${restaurant.restaurantName}`}>
                            <button className="btn btn-ghost btn-xs text-xl">Details</button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-black font-bold text-center mt-5">No restaurants found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
