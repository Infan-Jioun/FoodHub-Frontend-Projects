
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";


const Main = () => {
    const location = useLocation();
    const noNavbarFooter = ["/login" , "/register" , "/resetPassword" ,"/restaurantRegister" , "/dashboard/paymentSuccess" , "/search"].includes(location.pathname);
    return (
        <div>
          { noNavbarFooter || <Navbar/>  }
            <Outlet/>
            {noNavbarFooter || <Footer/>}
        </div>
    );
};

export default Main;