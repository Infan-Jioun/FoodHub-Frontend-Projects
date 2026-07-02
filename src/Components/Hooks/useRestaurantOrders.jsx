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
      const restaurantRes = await axiosSecure.get(`/restaurant/by-email/${user.email}`);
      const restaurantName = restaurantRes.data?.restaurantName; // ← .data direct, .data.data na

      if (!restaurantName) return [];

      const ordersRes = await axiosSecure.get(`/payments/orders?restaurantName=${encodeURIComponent(restaurantName)}`);
      return ordersRes.data; 
    }
  });
};

export default useRestaurantOrders;