import React from 'react';
import RestaurantBanner from '../RestaurantBanner/RestaurantBanner';
import RestaurentBannerTwo from '../RestaurentBannerTwo/RestaurentBannerTwo';
import RestaurantsCard from '../RestaurantsCard/RestaurantsCard';
import RatingSlider from '../../Home/RatingSlider/RatingSlider';
import { Helmet } from 'react-helmet';

const Restaurants = () => {
    return (
        <div>
            <Helmet>
                <title>Restaurants | FOODHUB </title>
            </Helmet>
            <RestaurantBanner />
            <div className='flex justify-center items-center font-Caveat'>
                <RestaurentBannerTwo
                    text="Your Favorite Restaurant"
                    delay={100}
                    animateBy="words"
                    className="mt-10 px-4 text-center font-bold drop-shadow-2xl text-[#ff1818]"
                />
            </div>
            <RestaurantsCard />
            <RatingSlider />
        </div>
    );
};

export default Restaurants;