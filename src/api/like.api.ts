import axiosInstance from "./axios";
import type { ApiResponse,Video } from '../types'

export const toggleVideoLike = async (videoId:string) => {
          const res = await axiosInstance.post<ApiResponse<{}>>(
                    `/likes/toggle/v/${videoId}`,
          )
          return res.data
}

export const toggleCommentLike = async (commentId:string) => {
          const res = await axiosInstance.post<ApiResponse<{}>>(
                    `/likes/toggle/c/${commentId}`,
          )
          return res.data
}

export const toggleTweetLike = async (tweetId:string) => {
          const res = await axiosInstance.post<ApiResponse<{}>>(
                    `/likes/toggle/t/${tweetId}`,
          )
          return res.data
}

export const getLikedVideos = async () => {
          const res = await axiosInstance.get<ApiResponse<Video[]>>(
                    '/likes/liked-videos/'
          )
          return res.data
}