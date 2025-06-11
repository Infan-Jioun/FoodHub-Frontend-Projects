import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


const useAllUserHooks = () => {
  const axiosSecure = useAxiosSecure();
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users")

      // console.log(res.data);
      return res.data;
    }
  })

  return [users, isLoading, refetch]
};

export default useAllUserHooks;