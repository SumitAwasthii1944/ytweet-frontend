import axios from "axios"

const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000"
const axiosInstance = axios.create({
    baseURL: `${API_BASE}/api/v1`,
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