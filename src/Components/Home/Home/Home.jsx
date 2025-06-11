import { Helmet } from "react-helmet";
import Banner from "../Banner/Banner";
import BannerTwo from "../BannerTwo/BannerTwo";
import ServeFood from "../ServeFood/ServeFood";
import Food from "../Food/Food";
import AvailableItem from "../AvailableItem/AvailableItem";
import BannerFour from "../bannerFour/BannerFour";
import DistrictAvailable from "../DistrictAvailable/DistrictAvailable/DistrictAvailable";
import Delivery from "../Delivery/Delivery";
import RatingSlider from "../RatingSlider/RatingSlider";

const Home = () => {
    return (
        <div className="">
            <Helmet>
                <title>FOODHUB</title>
            </Helmet>
         <Banner/>
         <BannerTwo/>
         <BannerFour/>
         <br />
         <AvailableItem/>
         <br />
         <ServeFood/>
         <DistrictAvailable/>
         <Delivery/>
         <RatingSlider/>
        </div>
    );
};

export default Home;