import axiosInstance from "./axios";
import type {
          ApiResponse ,
          ChannelSubscriber,
          SubscribedChannel,
          ToggleSubscriptionResponse
} from '../types'

export const toggleSubscription = async (channelId:string) => {
          const res = await axiosInstance.post<ApiResponse<ToggleSubscriptionResponse>>(
                    `/subscriptions/c/${channelId}`
          )
          return res.data
}

export const getUserChannelSubscribers = async (channelId:string) => {
          const res = await axiosInstance.get<ApiResponse<ChannelSubscriber[]>>(
                    `/subscriptions/u/${channelId}`
          )
          return res.data
}

export const getSubscribedChannels = async (subscriberId:string) => {
          const res = await axiosInstance.get<ApiResponse<SubscribedChannel[]>>(
                    `/subscriptions/c/${subscriberId}`
          )
          return res.data
}