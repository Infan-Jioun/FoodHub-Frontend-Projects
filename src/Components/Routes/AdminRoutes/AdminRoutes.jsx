import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import { Circles } from "react-loader-spinner";

const AdminRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const location = useLocation();
  if (loading || isAdminLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
         <img
      src="https://i.ibb.co.com/F57mtch/logo2.png"
      alt="Loading Logo"
      className="w-28 h-28 object-contain animate-pulse"
    />
      </div>
    );
  }


  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;
};

export default AdminRoutes;
