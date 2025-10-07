import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { Circles } from "react-loader-spinner";
import useAdmin from "../../Hooks/useAdmin";
import useModerator from "../../Hooks/useModerator";
import useRestaurantOwner from "../../Hooks/useRestaurantOwner";

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin] = useAdmin();
    const [isModerator] = useModerator();
    const [isOwner] = useRestaurantOwner();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <img
                    src="https://i.ibb.co.com/F57mtch/logo2.png"
                    alt="Loading Logo"
                    className="w-28 h-28 object-contain animate-pulse"
                />
            </div>
        );
    }

    if (!isAdmin || !isModerator || !isOwner) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoutes;
