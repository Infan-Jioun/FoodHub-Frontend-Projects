import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useModerator = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isModerator = false, refetch } = useQuery({
    queryKey: [user?.email, "isModerator"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/moderator/${user?.email}`);
      // console.log("isModerator:", res.data);
      return res.data?.moderator ?? false; 
    },
  });

  return [isModerator, refetch];
};

export default useModerator;
