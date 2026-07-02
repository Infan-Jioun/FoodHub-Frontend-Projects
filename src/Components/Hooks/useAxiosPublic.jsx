import axios from "axios";

const useAxiosPublic = () => {
    const axiosPublic = axios.create({
        baseURL: "https://foodhub-backend.vercel.app"
    });

    axiosPublic.interceptors.response.use(
        (response) => {
            if (
                response.data &&
                typeof response.data === "object" &&
                "success" in response.data &&
                "data" in response.data
            ) {
                response.data = response.data.data;
            }
            return response;
        },
        (error) => Promise.reject(error)
    );

    return axiosPublic;
};

export default useAxiosPublic;