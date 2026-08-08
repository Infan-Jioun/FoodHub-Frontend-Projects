import { IoSearch, IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTypewriter } from "react-simple-typewriter";
import useRestaurantData from "../../Hooks/useRestaurantData";
import { useDebounce } from "../../Hooks/useDebounce";
import { FaUtensils, FaStore, FaClock } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Search = ({ searchQuery, setSearchQuery }) => {
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );
  const [showRecent, setShowRecent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);
  const [restaurantData, , isLoading] = useRestaurantData(debouncedQuery);

  const [text] = useTypewriter({
    words: [
      "Search your favorite restaurant...",
      "Pizza, Burger, Pasta...",
      "Find foods & categories...",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  // ✅ Restaurants
  const restaurantsResults = (restaurantData || []).map((r) => ({
    type: "restaurant",
    restaurantId: r._id,
    restaurantName: r.restaurantName,
    restaurantCategory: r.resataurantCategory || r.category || "",
    photo: r.photo || "/default-restaurant.png",
    foodCount: r.foods?.length || 0,
    location: r.location || "",
  }));

  // ✅ Foods — সব restaurant এর foods flatten
  const foodsResults = (restaurantData || []).flatMap((r) =>
    (r.foods || []).map((food) => ({
      type: "food",
      restaurantId: r._id,
      restaurantName: r.restaurantName,
      foodName: food.foodName,
      foodCategory: food.category || "",
      foodImage: food.foodImage || "/default-food.png",
      foodId: food._id,
      foodPrice: food.foodPrice || food.price || 0,
    }))
  );

  // ✅ Tab নেই — সব একসাথে, restaurant আগে food পরে
  const mergedResults = [
    ...restaurantsResults,
    ...foodsResults,
  ];

  const hasResults = mergedResults.length > 0;
  const showDropdown = isFocused && (showRecent || !!debouncedQuery);

  // ── Handlers ──
  const updateRecentSearches = (term) => {
    if (!term?.trim()) return;
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleDeleteRecent = (term, e) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = recentSearches.filter((t) => t !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleClear = () => {
    setSearchQuery("");
    setShowRecent(true);
    inputRef.current?.focus();
  };

  const handleSelect = (term) => {
    setSearchQuery(term);
    updateRecentSearches(term);
    setShowRecent(false);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!searchQuery) setShowRecent(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowRecent(false);
    }, 200);
  };

  // ✅ Highlight matched keyword
  const highlight = (str = "") => {
    if (!debouncedQuery) return str;
    const escaped = debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = str.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === debouncedQuery.toLowerCase() ? (
        <mark key={idx} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5 not-italic">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative w-full" ref={searchRef}>

      {/* ── Search Input ── */}
      <div className={`flex items-center bg-white border-2 rounded-full shadow-md transition-all duration-300 relative ${isFocused ? "border-[#ff1818] shadow-red-100 shadow-lg" : "border-red-200"
        }`}>
        {isLoading && debouncedQuery ? (
          <div className="absolute left-4">
            <div className="w-4 h-4 border-2 border-[#ff1818] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <IoSearch className={`absolute left-4 text-lg transition-colors ${isFocused ? "text-[#ff1818]" : "text-red-300"}`} />
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder={text}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) setShowRecent(false);
            else setShowRecent(true);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-[240px] lg:w-[500px] pl-11 pr-10 py-2.5 rounded-full bg-transparent text-gray-800 placeholder-red-300 font-medium text-[15px] outline-none"
        />

        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-300 hover:text-[#ff1818] transition"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 w-full bg-white border border-red-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >

            {/* ── Recent Searches ── */}
            {showRecent && !searchQuery && (
              <div>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FaClock className="text-[#ff1818]" /> Recent Searches
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-gray-400 hover:text-[#ff1818] transition"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {recentSearches.length ? (
                  recentSearches.map((term, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center px-4 py-2.5 hover:bg-red-50 cursor-pointer group transition"
                      onClick={() => handleSelect(term)}
                    >
                      <div className="flex items-center gap-3">
                        <IoSearch className="text-gray-300 group-hover:text-[#ff1818] transition text-sm flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{term}</span>
                      </div>
                      <button
                        className="text-gray-300 hover:text-[#ff1818] p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => handleDeleteRecent(term, e)}
                      >
                        <IoClose size={13} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-5 text-sm text-gray-400 text-center">No recent searches</p>
                )}
              </div>
            )}

            {/* ── Search Results ── */}
            {debouncedQuery && (
              <>
                {isLoading ? (
                  // Skeleton
                  <div className="p-3 space-y-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3 px-2 py-2.5 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-2/5" />
                          <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                        </div>
                        <div className="h-3 bg-gray-100 rounded w-10" />
                      </div>
                    ))}
                  </div>

                ) : hasResults ? (
                  <div className="max-h-[420px] overflow-y-auto">

                    {/* Section label — Restaurants */}
                    {restaurantsResults.length > 0 && (
                      <>
                        <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100 sticky top-0 z-10">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <FaStore className="text-[#ff1818]" />
                            Restaurants
                            <span className="ml-1 px-1.5 py-0.5 bg-red-50 text-[#ff1818] rounded-full text-[9px]">
                              {restaurantsResults.length}
                            </span>
                          </span>
                        </div>

                        {restaurantsResults.map((item, idx) => (
                          <Link
                            key={`r-${idx}`}
                            to={`/restaurant/${item.restaurantName}`}
                            onClick={() => handleSelect(item.restaurantName)}
                          >
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-red-50/60 transition group border-b border-gray-50">
                              {/* Image */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={item.photo}
                                  alt={item.restaurantName}
                                  className="w-11 h-11 rounded-xl object-cover border border-red-100"
                                  onError={(e) => { e.target.src = "/default-restaurant.png"; }}
                                />
                                <span className="absolute -bottom-1 -right-1 bg-[#ff1818] rounded-full p-[3px]">
                                  <FaStore className="text-white text-[6px]" />
                                </span>
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-[#ff1818] transition">
                                  {highlight(item.restaurantName)}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  {item.restaurantCategory && (
                                    <span className="text-xs text-gray-400">{item.restaurantCategory}</span>
                                  )}
                                  {item.location && (
                                    <>
                                      <span className="text-gray-200 text-xs">•</span>
                                      <span className="text-xs text-gray-400">{item.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Badge */}
                              <span className="text-[11px] bg-red-50 text-[#ff1818] px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                                {item.foodCount} items
                              </span>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}

                    {/* Section label — Foods */}
                    {foodsResults.length > 0 && (
                      <>
                        <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100 sticky top-0 z-10">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <FaUtensils className="text-orange-400" />
                            Foods
                            <span className="ml-1 px-1.5 py-0.5 bg-orange-50 text-orange-400 rounded-full text-[9px]">
                              {foodsResults.length}
                            </span>
                          </span>
                        </div>

                        {foodsResults.map((item, idx) => (
                          <Link
                            key={`f-${idx}`}
                            to={`/restaurant/${item.restaurantName}`}
                            onClick={() => handleSelect(item.foodName)}
                            state={{ scrollToFood: item.foodId }}
                          >
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50/40 transition group border-b border-gray-50">
                              {/* Image */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={item.foodImage}
                                  alt={item.foodName}
                                  className="w-11 h-11 rounded-xl object-cover border border-orange-100"
                                  onError={(e) => { e.target.src = "/default-food.png"; }}
                                />
                                <span className="absolute -bottom-1 -right-1 bg-orange-400 rounded-full p-[3px]">
                                  <FaUtensils className="text-white text-[6px]" />
                                </span>
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-[#ff1818] transition">
                                  {highlight(item.foodName)}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  {item.foodCategory && (
                                    <span className="text-xs text-gray-400">{item.foodCategory}</span>
                                  )}
                                  <span className="text-gray-200 text-xs">•</span>
                                  <span className="text-xs text-gray-400">
                                    from{" "}
                                    <span className="text-[#ff1818] font-medium">
                                      {item.restaurantName}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Price */}
                              {item.foodPrice > 0 && (
                                <span className="text-xs font-bold text-[#ff1818] flex-shrink-0">
                                  ${Number(item.foodPrice).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>

                ) : (
                  // No results
                  <div className="py-12 flex flex-col items-center gap-2">
                    <IoSearch className="text-gray-200 text-5xl" />
                    <p className="text-sm font-medium text-gray-400">
                      No results for{" "}
                      <span className="text-gray-600 font-semibold">&#34;{debouncedQuery}&ldquo;</span>
                    </p>
                    <p className="text-xs text-gray-300">Try a different keyword</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;