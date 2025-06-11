import { useParams } from "react-router-dom";
import DeatilsRestaurants from "../../Restaurants/DetailsRestaurants/DeatilsRestaurants";
import DistrictRes from "../../Home/DistrictAvailable/DistrictRes/DistrictRes";

const RestaurantPage = () => {
    const { param } = useParams();

    // Example logic: Check if `param` is a district or restaurant
    const districtList = ["dhaka", "chittagong", "khulna", "rajshahi", "sylhet"]; // Add all districts

    const isDistrict = districtList.includes(param.toLowerCase());

    return (
        <div>
            {isDistrict ? (
                <DistrictRes name={param} />
            ) : (
                <DeatilsRestaurants name={param} />
            )}
        </div>
    );
};

export default RestaurantPage;
