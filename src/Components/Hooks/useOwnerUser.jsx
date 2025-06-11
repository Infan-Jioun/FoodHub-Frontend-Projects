// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "./useAxiosSecure";

// const useOwnerUser = () => {
//     const axiosSecure = useAxiosSecure();
//     const { data: users = [], isLoading, refetch } = useQuery({
//         queryKey: ["ownerUser"],
//         queryFn: async () => {
//             const res = await axiosSecure.get("/users");
//             return res.data;
//         },
//     });
//     return [users, isLoading, refetch];
// };

// export default useOwnerUser;

