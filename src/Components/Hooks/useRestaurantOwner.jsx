import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRestaurantOwner = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isOwner = false, refetch } = useQuery({
    queryKey: [user?.email, "isOwner"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/restaurantOwner/${user?.email}`);
      // console.log("isOwner:", res.data);
      return res.data?.owner ?? false; // Ensure it returns a boolean
    },
  });

  return [isOwner, refetch];
};

export default useRestaurantOwner;
