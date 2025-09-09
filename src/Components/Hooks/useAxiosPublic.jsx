import axios from "axios";


const useAxiosPublic = () => {
    const axiosPublic = axios.create({
         baseURL : "https://foodhub-backend.vercel.app"
    })
    return axiosPublic
};

export default useAxiosPublic;