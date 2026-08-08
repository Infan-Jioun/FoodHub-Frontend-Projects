import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ScrollToTop from "../../ScrollToTop";


const Main = () => {
    const location = useLocation();

    const noNavbarFooter = [
        "/authentication",
        "/login",
        "/register",
        "/resetPassword",
        "/restaurantRegister",
        "/dashboard/paymentSuccess",
        "/search",
    ].includes(location.pathname);

    return (
        <div>
            <ScrollToTop />

            {!noNavbarFooter && <Navbar />}

            <Outlet />

            {!noNavbarFooter && <Footer />}
        </div>
    );
};

export default Main;