// useRestaurantOrders.js
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useRestaurantOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['restaurantOrders', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      // First get the restaurant name (assumes you have a route to fetch it by email)
      const restaurantRes = await axiosSecure.get(`/restaurantManage/${user.email}`);
      const restaurantName = restaurantRes.data?.restaurantName;

      const ordersRes = await axiosSecure.get(`/orders?restaurantName=${restaurantName}`);
      return ordersRes.data;
    }
  });
};

export default useRestaurantOrders;
