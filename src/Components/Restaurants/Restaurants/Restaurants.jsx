import React from 'react';
import RestaurantBanner from '../RestaurantBanner/RestaurantBanner';
import RestaurentBannerTwo from '../RestaurentBannerTwo/RestaurentBannerTwo';
import RestaurantsCard from '../RestaurantsCard/RestaurantsCard';

const Restaurants = () => {
    return (
        <div>
            <RestaurantBanner />
         <div className='flex justify-center items-center font-Caveat'>
         <RestaurentBannerTwo
                text="Your Favorite Restaurant"
                delay={100}
                animateBy="words"
                className="mt-10 px-4 text-cente   font-bold drop-shadow-2xl text-[#ff0000d8]"
            />
         </div>
            <RestaurantsCard />
        </div>
    );
};

export default Restaurants;