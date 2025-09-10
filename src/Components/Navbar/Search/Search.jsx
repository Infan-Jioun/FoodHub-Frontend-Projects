import { IoSearch, IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTypewriter } from "react-simple-typewriter";
import useRestaurantData from "../../Hooks/useRestaurantData";

const Search = ({ searchQuery, setSearchQuery }) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restaurantData] = useRestaurantData();
  const searchRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );
  const [showRecent, setShowRecent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [text] = useTypewriter({
    words: [
      "Search your favorite restaurant...",
      "Pizza, Burger, Pasta...",
      "Find foods & categories...",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  const updateRecentSearches = (term) => {
    if (!term) return;
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleDeleteRecent = (term, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(t => t !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredResults([]);
      if (isFocused) {
        setShowRecent(true);
      }
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      const restaurantResults = [];
      const foodResults = [];
      const matchedRestaurantIds = new Set();

      // First pass: Find matching restaurants and their foods
      restaurantData.forEach((restaurant) => {
        const restaurantMatch = restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (restaurantMatch) {
          restaurantResults.push({
            type: "restaurant",
            restaurantId: restaurant._id,
            restaurantName: restaurant.restaurantName,
            restaurantCategory: restaurant.resataurantCategory || restaurant.category,
            photo: restaurant.photo || "/default-restaurant.png",
            foodCount: restaurant.foods?.length || 0
          });
          
          // Add all foods from this restaurant to food results
          restaurant.foods?.forEach((food) => {
            foodResults.push({
              type: "food",
              restaurantId: restaurant._id,
              restaurantName: restaurant.restaurantName,
              foodName: food.foodName,
              foodCategory: food.category,
              foodImage: food.foodImage || "/default-food.png",
              foodId: food._id,
              fromMatchedRestaurant: true // Flag to indicate this food comes from a matched restaurant
            });
          });
          
          matchedRestaurantIds.add(restaurant._id);
        }
      });

      // Second pass: Find matching foods from restaurants that didn't match by name
      restaurantData.forEach((restaurant) => {
        if (matchedRestaurantIds.has(restaurant._id)) {
          // Skip restaurants already processed
          return;
        }

        restaurant.foods?.forEach((food) => {
          if (food.foodName.toLowerCase().includes(searchQuery.toLowerCase())) {
            foodResults.push({
              type: "food",
              restaurantId: restaurant._id,
              restaurantName: restaurant.restaurantName,
              foodName: food.foodName,
              foodCategory: food.category,
              foodImage: food.foodImage || "/default-food.png",
              foodId: food._id,
              fromMatchedRestaurant: false
            });
            
            // Also add the restaurant to restaurant results if it's not already there
            if (!restaurantResults.some(r => r.restaurantId === restaurant._id)) {
              restaurantResults.push({
                type: "restaurant",
                restaurantId: restaurant._id,
                restaurantName: restaurant.restaurantName,
                restaurantCategory: restaurant.resataurantCategory || restaurant.category,
                photo: restaurant.photo || "/default-restaurant.png",
                foodCount: restaurant.foods?.length || 0,
                hasMatchingFoods: true // Flag to indicate this restaurant has matching foods
              });
            }
          }
        });
      });

      // Auto-select the appropriate tab based on search results
      if (foodResults.length > 0 && restaurantResults.length === 0) {
        setActiveTab("foods");
      } else if (restaurantResults.length > 0 && foodResults.length === 0) {
        setActiveTab("restaurants");
      }

      setFilteredResults([...restaurantResults, ...foodResults]);
      setLoading(false);
      setShowRecent(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, restaurantData, isFocused]);

  const handleClear = () => {
    setSearchQuery("");
    setFilteredResults([]);
    if (isFocused) {
      setShowRecent(true);
    }
  };

  const handleSelect = (term) => {
    setSearchQuery(term);
    updateRecentSearches(term);
    setShowRecent(false);
    setFilteredResults([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!searchQuery) {
      setShowRecent(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowRecent(false);
    }, 200);
  };

  const highlight = (text) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={idx} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  const restaurantsResults = filteredResults.filter(r => r.type === "restaurant");
  const foodsResults = filteredResults.filter(r => r.type === "food");

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="flex items-center bg-white backdrop-blur-md border border-red-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative">
        <IoSearch className="absolute left-4 text-red-500 text-xl" />
        <input
          type="text"
          placeholder={text}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) {
              setShowRecent(false);
            } else if (isFocused) {
              setShowRecent(true);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-[240px] lg:w-[500px] pl-12 pr-10 py-2 rounded-full bg-white text-red-500 placeholder-red-400 font-medium text-lg outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-red-500 transition"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      {(showRecent || filteredResults.length > 0) && (
        <div className="absolute top-full mt-2 left-0 w-full max-h-96 overflow-y-auto bg-white/90 backdrop-blur-md border border-red-200 rounded-xl shadow-2xl z-50 animate-fadeIn">
          {loading ? (
            <div className="flex justify-center items-center p-6">
              <div className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : showRecent && !searchQuery ? (
            <div>
              <p className="p-2 text-gray-500 font-semibold border-b border-gray-200">Recent Searches</p>
              {recentSearches.length ? recentSearches.map((term, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 hover:bg-red-50 cursor-pointer rounded"
                  onClick={() => handleSelect(term)}
                >
                  <div className="flex items-center">
                    <IoSearch className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{term}</span>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                    onClick={(e) => handleDeleteRecent(term, e)}
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              )) : <p className="p-3 text-gray-400">No recent searches</p>}
            </div>
          ) : (
            filteredResults.length ? (
              <div>
                <div className="flex border-b border-red-200">
                  <button
                    className={`flex-1 py-2 text-center font-semibold ${activeTab === "restaurants"
                      ? "border-b-2 border-red-500 text-red-600"
                      : "text-gray-500"
                      } transition-colors duration-300`}
                    onClick={() => setActiveTab("restaurants")}
                  >
                    Restaurants ({restaurantsResults.length})
                  </button>
                  <button
                    className={`flex-1 py-2 text-center font-semibold ${activeTab === "foods"
                      ? "border-b-2 border-red-500 text-red-600"
                      : "text-gray-500"
                      } transition-colors duration-300`}
                    onClick={() => setActiveTab("foods")}
                  >
                    Foods ({foodsResults.length})
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {activeTab === "restaurants" && (
                    restaurantsResults.length ? (
                      restaurantsResults.map((r, idx) => (
                        <Link
                          key={idx}
                          to={`/restaurantUpload/${r.restaurantName}`}
                          onClick={() => handleSelect(r.restaurantName)}
                        >
                          <div className="flex items-center p-3 hover:bg-red-50/50 transition cursor-pointer rounded-lg">
                            <img
                              src={r.photo}
                              alt={r.restaurantName}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-bold text-red-600">{highlight(r.restaurantName)}</p>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                  {r.foodCount} foods
                                </span>
                              </div>
                              <p className="text-gray-500 text-sm">{r.restaurantCategory}</p>
                              {r.hasMatchingFoods && (
                                <p className="text-xs text-green-600 mt-1">
                                  Has matching foods
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : <p className="text-center p-4 text-gray-500">No restaurants found</p>
                  )}

                  {activeTab === "foods" && (
                    foodsResults.length ? (
                      foodsResults.map((r, idx) => (
                        <Link
                          key={idx}
                          to={`/restaurantUpload/${r.restaurantName}`}
                          onClick={() => handleSelect(r.foodName)}
                          state={{ scrollToFood: r.foodId }}
                        >
                          <div className="flex items-center p-3 hover:bg-red-50/50 transition cursor-pointer rounded-lg">
                            <img
                              src={r.foodImage}
                              alt={r.foodName}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-red-600">{highlight(r.foodName)}</p>
                              <p className="text-gray-700 text-sm">{r.foodCategory}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500 mr-1">from</span>
                                <span className="text-xs font-medium text-red-500">{r.restaurantName}</span>
                              </div>
                              {r.fromMatchedRestaurant && (
                                <p className="text-xs text-green-600 mt-1">
                                  From searched restaurant
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : <p className="text-center p-4 text-gray-500">No foods found</p>
                  )}
                </div>
              </div>
            ) : searchQuery && <p className="text-center p-4 text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;