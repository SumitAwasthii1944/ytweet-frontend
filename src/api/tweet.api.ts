import axiosInstance from "./axios";
import type {
          ApiResponse,
          Tweet,
          TweetsPaginated,
          TweetQueryParams,
          CreateTweetInput,
          UpdateTweetInput
} from '../types'

export const createTweet = async (data:CreateTweetInput) => {
          const formData = new FormData();
          formData.append("title",data.title);
          formData.append("content",data.content);
          if(data.media) formData.append("media",data.media)

          const res = await axiosInstance.post<ApiResponse<Tweet>>(
                    '/tweets/',
                    formData,
                    {headers: { "Content-Type": "multipart/form-data" }}
          )

          return res.data
}

export const  getUserTweets = async (params:TweetQueryParams) => {
          const res = await axiosInstance.get<ApiResponse<TweetsPaginated>>(
                    `/tweets/`,
                    {
                              params
                    }
          )
          return res.data
}

export const updateTweet = async (data:UpdateTweetInput,tweetId:string) => {
          const formData = new FormData();
          if(data.title) formData.append("title",data.title);
          if(data.content) formData.append("content",data.content);
          if(data.media) formData.append("media",data.media)
          const res = await axiosInstance.patch<ApiResponse<Tweet>>(
                    `/tweets/${tweetId}`,
                    formData,
                    {headers: { "Content-Type": "multipart/form-data" }}
          )
          return res.data
}

export const deleteTweet = async (tweetId:string) => {
          const res = await axiosInstance.delete<ApiResponse<{}>>(
                    `/tweets/${tweetId}`
          )
          return res.data
}
