import React from 'react';
import RestaurantBanner from '../RestaurantBanner/RestaurantBanner';
import RestaurentBannerTwo from '../RestaurentBannerTwo/RestaurentBannerTwo';
import RestaurantsCard from '../RestaurantsCard/RestaurantsCard';
import RatingSlider from '../../Home/RatingSlider/RatingSlider';

const Restaurants = () => {
    return (
        <div>
            <RestaurantBanner />
         <div className='flex justify-center items-center font-Caveat'>
         <RestaurentBannerTwo
                text="Your Favorite Restaurant"
                delay={100}
                animateBy="words"
                className="mt-10 px-4 text-cente   font-bold drop-shadow-2xl text-[#ff1818]"
            />
         </div>
            <RestaurantsCard />
            <RatingSlider/>
        </div>
    );
};

export default Restaurants;