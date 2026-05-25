
import {toggleLikeOnComment,toggleLikeOnTweet,toggleLikeOnVideo,fetchLikedVideos} from '../features/likeSlice'
import useAppDispatch from "./useAppDispatch"
import useAppSelector from "./useAppSelector"

// Gives any component access to like state + like actions
// Usage:
//   const { likedVideos,isLiked,likedVideosLoading, error} = useLike()

export const useLike = () => {
          const dispatch = useAppDispatch();
          const {likedVideos,isLiked,likedVideosLoading, error} = useAppSelector((state) => state.likes)

          const toggleVideoLike = ({videoId,isLiked,likesCount}:{videoId:string,isLiked:boolean,likesCount:number}) => {
                    dispatch(toggleLikeOnVideo({videoId,isLiked,likesCount}))
          }

          const toggleCommentLike = ({commentId,isLiked,likesCount}:{commentId:string,isLiked:boolean,likesCount:number}) => {
                    dispatch(toggleLikeOnComment({commentId,isLiked,likesCount}))
          }

          const toggleTweetLike = ({tweetId,isLiked,totalLikes}:{tweetId:string,isLiked:boolean,totalLikes:number}) => {
                    dispatch(toggleLikeOnTweet({tweetId,isLiked,totalLikes}))
          }

          const getLikedVideos = () => {
                    dispatch(fetchLikedVideos())
          }

          return {
                    likedVideos,
                    isLiked,
                    likedVideosLoading,
                    error,
                    toggleCommentLike,
                    toggleTweetLike,
                    toggleVideoLike,
                    getLikedVideos
          }
}