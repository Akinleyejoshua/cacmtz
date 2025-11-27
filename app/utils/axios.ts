// prepare and configure an axios instance 
import axios from "axios";
const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        "Accept":"*"
    },
}); 

request.interceptors.response.use(
    (response) => response,
    (error) => {
        throw error;
    }
); 

export default request