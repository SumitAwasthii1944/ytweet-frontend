import {clearError,clearTweets} from '../features/tweetSlice'
import { postTweet,removeTweet,editTweet,getTweets } from "../features/tweetSlice";
import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import type {
    TweetQueryParams,
    UpdateTweetInput,
    CreateTweetInput
} from "../types"

export const useTweets = () => {
          const dispatch=useAppDispatch();
          const {tweets,loading, uploadLoading,error,hasMore,page} = useAppSelector((state) => state.tweets)

          const createTweet = (data:CreateTweetInput) => {
                    dispatch(postTweet(data))
          }

          const updateTweet = (data:UpdateTweetInput,tweetId:string) => {
                    dispatch(editTweet({data,tweetId}))
          }
          
          const deleteTweet = (tweetId:string) => {
                    dispatch(removeTweet(tweetId))
          }
          const resetTweets = () => {
                dispatch(clearTweets())
          }
          const fetchTweets = (params:TweetQueryParams) => {
                    dispatch(getTweets(params))
          }
          const resetError = () => {
                dispatch(clearError())
          }

          return {
                    tweets,
                    loading, 
                    uploadLoading,
                    error,
                    hasMore,
                    page,
                    createTweet,
                    updateTweet,
                    deleteTweet,
                    fetchTweets,
                    resetTweets,
                    resetError
          }
}

