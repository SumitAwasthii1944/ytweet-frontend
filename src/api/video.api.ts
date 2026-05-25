import axiosInstance from "./axios";
import type {
          ApiResponse,
          Video,
          VideosPaginated,
          PublishVideoInput,
          UpdateVideoInput,
          VideoQueryParams

} from "../types"

export const getAllVideos = async (params:VideoQueryParams) => {
          const res=await axiosInstance.get<ApiResponse<VideosPaginated>>(
                    "/videos/",
                    {
                              params
                    }
          )
          return res.data
}

export const publishAVideo = async (data:PublishVideoInput) => {
          const formData=new FormData()
          formData.append("title",data.title)
          formData.append("description",data.description)
          formData.append("videoFile",data.videoFile)
          formData.append("thumbnail",data.thumbnail)
          formData.append("isPublished", String(data.isPublished ?? true))
          const res= await axiosInstance.post<ApiResponse<Video>>(
                    "/videos/",
                    formData,
                    {headers: { "Content-Type": "multipart/form-data" }}
          )
          return res.data
}

export const getVideoById = async (videoId:string) => {
          const res=await axiosInstance.get<ApiResponse<Video>>(
                    `/videos/${videoId}`
          )
          return res.data
}

export const deleteVideo = async (videoId:string) => {
          const res= await axiosInstance.delete<ApiResponse<{}>>(
                    `/videos/${videoId}`
          )
          return res.data
}

export const updateVideo = async (data:UpdateVideoInput,videoId:string) => {
          const formData=new FormData()
          if(data.title){
                    formData.append("title",data.title)
          }
          if(data.description){
                    formData.append("description",data.description)
          }
          if(data.thumbnail){
                    formData.append("thumbnail",data.thumbnail)
          }
          const res = await axiosInstance.patch<ApiResponse<Video>>(
                    `/videos/${videoId}`,
                    formData,
                    {headers: { "Content-Type": "multipart/form-data" }}
          )
          return res.data
          
}

export const togglePublishStatus = async (videoId:string) => {
          const res = await axiosInstance.patch<ApiResponse<Video>>(
                    `/videos/toggle/publish/${videoId}`
          )
          return res.data
}

export const incrementViews = async (videoId:string) => {
          const res= await axiosInstance.post<ApiResponse<{}>>(
                    `/videos/increment-views/${videoId}`
          )
          return res.data
}