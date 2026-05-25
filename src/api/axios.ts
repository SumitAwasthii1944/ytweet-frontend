import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,//sends cookies automatically
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message
            || error.message
            || "Something went wrong"
        return Promise.reject(new Error(message))
    }
)

export default axiosInstance