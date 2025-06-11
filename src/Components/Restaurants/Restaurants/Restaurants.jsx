import React from 'react';
import RestaurantBanner from '../RestaurantBanner/RestaurantBanner';
import RestaurentBannerTwo from '../RestaurentBannerTwo/RestaurentBannerTwo';
import RestaurantsCard from '../RestaurantsCard/RestaurantsCard';

const Restaurants = () => {
    return (
        <div>
         <RestaurantBanner/>
         <RestaurentBannerTwo/>
         <RestaurantsCard/>
        </div>
    );
};

export default Restaurants;