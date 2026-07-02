import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useUploadInfo = () => {
    const axiosSecure = useAxiosSecure();
    const { data: restaurantInfo = [] } = useQuery({
        queryKey: ["restaurantInfo"],
        queryFn: async () => {
            const res = await axiosSecure.get("/restaurant");
            return res.data.data;
        }
    });
    return [restaurantInfo];
};

export default useUploadInfo;