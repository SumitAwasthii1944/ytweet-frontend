import axiosInstance from "./axios"
import type {
    ApiResponse,
    User,
    AuthResponse,
    LoginInput,
    RegisterInput,
    UpdateAccountInput,
    ChangePasswordInput,
    ChannelProfile,
    WatchHistory,
} from "../types"

export const registerUser = async (data:RegisterInput,avatar:File,coverImage?:File) => {
    const formData=new FormData();
    formData.append("username",data.username)
    formData.append("fullName",data.fullName)
    formData.append("email",data.email)
    formData.append("password",data.password)
    formData.append("avatar",avatar)  //matches name: "avatar"
    if (coverImage) formData.append("coverImage", coverImage)  // matches name: "coverImage"
    
    const res= await axiosInstance.post<ApiResponse<User>>(
            "/users/register",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
    )
    return res.data
}

export const loginUser = async (data:LoginInput) => {
    const res=await axiosInstance.post<ApiResponse<AuthResponse>>(
        "/users/login",
        data
    )
    return res.data
}

export const googleAuth = async (idToken: string) => {
    // Sends the ID token obtained from Google's client-side sign-in to the backend
    // which verifies it and returns the same auth response used by standard login.
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>( 
        "/users/google",
        { idToken }
    )
    return res.data
}

export const logoutUser = async () =>{
    const res = await axiosInstance.post<ApiResponse<{}>>(
        "/users/logout"
    )
    return res.data
}

export const refreshToken = async () => {
    const res = await axiosInstance.post<ApiResponse<{
        accessToken:string,
        refreshToken:string,
    }>>(
        "/users/refresh-token"
    )
    return res.data
}

export const getCurrentUser = async () => {
    const res = await axiosInstance.get<ApiResponse<User>>(
        "/users/current-user"
    )
    return res.data
}

export const searchUsers = async (query: string) => {
    const res = await axiosInstance.get<ApiResponse<User[]>>(
        "/users/search",
        { params: { query } }
    )
    return res.data
}

export const changeCurrentPassword = async (data:ChangePasswordInput) => {
    const res = await axiosInstance.post<ApiResponse<{}>>(
        "/users/change-password",
        data
    )
    return res.data
}

export const updateAccountDetails = async (data:UpdateAccountInput) => {
    const res = await axiosInstance.patch<ApiResponse<User>>(
        "/users/update-account",
        data
    )
    return res.data
}

export const updateAvatar = async (avatar:File) => {
    const formData = new FormData()
    formData.append("avatar", avatar)  // matches upload.single("avatar")
    const res = await axiosInstance.patch<ApiResponse<User>>(
        "/users/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    )
    return res.data
}

export const updateCoverImage = async (coverImage:File) => {
    const formData = new FormData()
    formData.append("coverImage", coverImage)  // matches upload.single("coverImage")

    const res = await axiosInstance.patch<ApiResponse<User>>(
        "/users/cover-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    )
    return res.data
}

export const getUserChannelProfile= async (username: string) => {
    const res = await axiosInstance.get<ApiResponse<ChannelProfile>>(
        `/users/c/${username}`,
    )
    return res.data
}

export const watchHistory = async () => {
    const res = await axiosInstance.get<ApiResponse<WatchHistory[]>>(
        "/users/history"
    )
    return res.data
}