import type { Video } from '../types'
import { createAsyncThunk,createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {toggleVideoLike,toggleCommentLike,toggleTweetLike,getLikedVideos} from '../api/like.api'

interface likeState {
          error:string | null
          likedVideos:Video[]
          likedVideosLoading:boolean
          isLiked:boolean
}

const initialState:likeState={
          error:null,
          likedVideos:[],
          likedVideosLoading:false,
          isLiked:false
}

export const toggleLikeOnVideo = createAsyncThunk(
          'likes/toggleVideo',
          async ({videoId,isLiked,likesCount}:{videoId:string,isLiked:boolean,likesCount:number},{rejectWithValue}) => {
                    try {
                              await toggleVideoLike(videoId)
                              // return new state so videoSlice can sync currentVideo
                              return{
                                        videoId,
                                        isLiked:!isLiked,
                                        likesCount:isLiked ? likesCount-1:likesCount+1
                              }
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to toggle like")
                    }
          }
)
export const toggleLikeOnComment = createAsyncThunk(
          'likes/toggleComment',
          async ({commentId,isLiked,likesCount}:{commentId:string,isLiked:boolean,likesCount:number},{rejectWithValue}) => {
                    try {
                              await toggleCommentLike(commentId)
                              // return new state so videoSlice can sync currentVideo
                              return{
                                        commentId,
                                        isLiked:!isLiked,
                                        likesCount:isLiked ? likesCount-1:likesCount+1
                              }
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to toggle like")
                    }
          }
)
export const toggleLikeOnTweet = createAsyncThunk(
          'likes/toggleTweet',
          async ({tweetId,isLiked,totalLikes}:{tweetId:string,isLiked:boolean,totalLikes:number},{rejectWithValue}) => {
                    try {
                              await toggleTweetLike(tweetId)
                              // return new state so videoSlice can sync currentVideo
                              return{
                                        tweetId,
                                        isLiked:!isLiked,
                                        totalLikes:isLiked ? totalLikes-1:totalLikes+1
                              }
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to toggle like")
                    }
          }
)

export const fetchLikedVideos = createAsyncThunk(
          'likes/likesVideos',
          async (_ , {rejectWithValue}) => {
                    try {
                              const res = await getLikedVideos()
                              return res.data//video[]
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to fetch liked videos")
                    }
          }
)

// These thunks return enough info for videoSlice/commentSlice/tweetSlice
// to update their own state via extraReducers (cross-slice sync)

const likeSlice = createSlice({
          name:"likes",
          initialState,
          reducers:{
                    clearLikedVideos:(state) => {
                              state.likedVideos=[]
                    },
                    clearError: (state) => {
                              state.error=null
                    }
          },
          extraReducers:(builder) => {
                    builder.addCase(fetchLikedVideos.pending,(state) => {
                              state.likedVideosLoading=true
                              state.error=null
                    })
                    builder.addCase(fetchLikedVideos.fulfilled,(state,action:PayloadAction<Video[]>) => {
                              state.likedVideosLoading=false
                              state.likedVideos=action.payload
                    })
                    builder.addCase(fetchLikedVideos.rejected,(state,action) => {
                              state.likedVideosLoading=false
                              state.error=action.payload as string
                    })

                    // ── likeVideo / likeComment / likeTweet ──────────────────────────────────
                    // likeSlice itself doesn't need to store individual like states
                    // it just handles errors — the actual UI update happens in
                    // videoSlice / commentSlice / tweetSlice extraReducers below
                    builder.addCase(toggleLikeOnVideo.rejected, (state, action) => {
                              state.error = action.payload as string
                    })
                    builder.addCase(toggleLikeOnComment.rejected, (state, action) => {
                              state.error = action.payload as string
                    })
                    builder.addCase(toggleLikeOnTweet.rejected, (state, action) => {
                              state.error = action.payload as string
                    })
          }
})
export const {clearLikedVideos,clearError} = likeSlice.actions
export default likeSlice.reducer