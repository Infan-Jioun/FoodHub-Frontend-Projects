import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
} from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { useEffect, useState } from "react";
import useAdmin from "../../../Hooks/useAdmin";
import useModerator from "../../../Hooks/useModerator";

const DistrictRes = () => {
    const { districtName } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [isAdmin] = useAdmin();
    const [isModerator] = useModerator();

    useEffect(() => {
        axios.get(`https://foodhub-backend.vercel.app/restaurantUpload/district/${districtName}`)
            .then(response => setRestaurants(response.data))
            .catch(error => console.error("Error fetching restaurants:", error));
    }, [districtName]);

    const handleDeleted = (restaurantName) => {
        console.log("Deleting:", restaurantName);
    };

    return (
        <div className="max-w-7xl min-h-screen mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-gray-800 font-Caveat text-center mb-8">
                Restaurants in {districtName}
            </h2>

            {restaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants.map((restaurant) => (
                        <Card
                            key={restaurant._id}
                            shadow={false}
                            className="relative w-full max-w-[400px] mx-auto rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105"
                        >
                            {/* Banner Image */}
                            <CardHeader
                                floated={false}
                                shadow={false}
                                className="relative h-[250px] bg-cover bg-center"
                                style={{ backgroundImage: `url(${restaurant.banner})` }}
                            >
                                <div className="absolute inset-0 transition-all duration-300" />
                            </CardHeader>

                            {/* Card Body */}
                            <CardBody className="text-center p-6">
                                <Typography  className="text-[18px] font-bold font-Caveat text-gray-900">
                                    {restaurant?.restaurantName}
                                </Typography>
                                <Typography className="mb-2 font-Kanit ">
                {restaurant?.restaurantAddress}
              </Typography>
                                {/* Avatar & Link */}
                                <div className="mt-4 flex justify-center">
                                    <Link to={`/restaurantUpload/${restaurant.restaurantName}`}>
                                        <Avatar
                                            size="xl"
                                            variant="circular"
                                            alt={restaurant?.restaurantName}
                                            className="border-2 border-gray-300 shadow-lg transition-transform duration-300 hover:scale-110"
                                            src={restaurant?.photo}
                                        />
                                    </Link>
                                </div>

                                {/* Delete Button for Admin/Moderator */}
                                {(isAdmin || isModerator) && (
                                    <motion.button
                                        onClick={() => handleDeleted(restaurant.restaurantName)}
                                        className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-md hover:bg-red-700 transition-all"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <AiOutlineDelete size={20} />
                                    </motion.button>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No restaurants found.</p>
            )}
        </div>
    );
};

export default DistrictRes;
