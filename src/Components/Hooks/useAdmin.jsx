import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin = false, isLoading : isAdminLoading, refetch } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/admin/${user?.email}`);
      // console.log("isAdmin:", res.data);
      return res.data?.admin ?? false; 
    },
  });

  return [isAdmin, isAdminLoading,refetch];
};

export default useAdmin;
