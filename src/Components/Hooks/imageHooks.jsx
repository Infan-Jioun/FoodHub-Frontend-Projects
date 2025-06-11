import axios from "axios";
export const imageUpload = async photo => {
    const formData = new FormData();
    formData.append("image" , photo)
    const  {data} = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`, 
        formData 
    )
    return data
}
