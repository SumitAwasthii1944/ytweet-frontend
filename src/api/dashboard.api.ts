import axiosInstance from "./axios";

import type {
          ApiResponse,
          ChannelStats,
          DashboardChannelVideo,
          DashboardChannelTweet
} from '../types'

export const getChannelStats = async () => {
          const res = await axiosInstance.get<ApiResponse<ChannelStats>>(
                    "/dashboard/stats"
          )
          return res.data
}

export const getChannelVideos = async () => {
          const res = await axiosInstance.get<ApiResponse<DashboardChannelVideo[]>>(
                    `/dashboard/videos`
          )
          return res.data
}
export const getChannelTweets = async () => {
          const res = await axiosInstance.get<ApiResponse<DashboardChannelTweet[]>>(
                    `/dashboard/tweets`
          )
          return res.data
}