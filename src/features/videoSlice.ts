import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  incrementViews
} from "../api/video.api"

import type {
  Video,
  VideosPaginated,
  PublishVideoInput,
  UpdateVideoInput,
  VideoQueryParams,
} from "../types"
import { toggleLikeOnVideo } from "./likeSlice"
// ─── State ────────────────────────────────────────────────────────────────────

interface VideoState {
  videos: Video[]
  currentVideo: Video | null
  loading: boolean
  uploadLoading: boolean   // separate loader for publish/update so list UI doesn't freeze
  error: string | null
    // pagination
  page: number
  totalPages: number
  hasMore: boolean
}

const initialState: VideoState = {
  videos: [],
  currentVideo: null,
  loading: false,
  uploadLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: true
}

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const getVideos = createAsyncThunk(
  "videos/getAll",
  async (params: VideoQueryParams, { rejectWithValue }) => {
    try {
      const res = await getAllVideos(params)
      return res.data // VideosPaginated
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch videos")
    }
  }
)

export const fetchVideoById = createAsyncThunk(
  "videos/getById",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await getVideoById(videoId)
      return res.data // Video
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch video")
    }
  }
)

export const publishVideo = createAsyncThunk(
  "videos/publish",
  async (data: PublishVideoInput, { rejectWithValue }) => {
    try {
      const res = await publishAVideo(data)
      return res.data // Video
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to publish video")
    }
  }
)

export const editVideo = createAsyncThunk(
  "videos/update",
  async (
    { data, videoId }: { data: UpdateVideoInput; videoId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await updateVideo(data, videoId)
      return res.data // Video
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update video")
    }
  }
)

export const removeVideo = createAsyncThunk(
  "videos/delete",
  async (videoId: string, { rejectWithValue }) => {
    try {
      await deleteVideo(videoId)
      return videoId // return id so reducer can remove it from list
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete video")
    }
  }
)

export const togglePublish = createAsyncThunk(
  "videos/togglePublish",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await togglePublishStatus(videoId)
      return res.data // updated Video
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle publish status")
    }
  }
)

export const incrementVideoViews = createAsyncThunk(
  "videos/incrementViews",
  async (videoId: string, { rejectWithValue }) => {
    try {
      await incrementViews(videoId)
      return videoId // return videoId to update state if needed
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to increment views")
    }
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null
    },
    clearVideos: (state) => {
      state.videos = []
      state.page = 1
      state.hasMore = true
      state.totalPages = 1
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {

    // getVideos 
    builder.addCase(getVideos.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getVideos.fulfilled, (state, action: PayloadAction<VideosPaginated>) => {
      state.loading = false
      const { docs, page, totalPages, hasNextPage } = action.payload

      // If page 1 — fresh fetch (search/filter reset), replace list
      // Otherwise — infinite scroll, append
      if (page === 1) {
        state.videos = docs
      } else {
        state.videos = [...state.videos, ...docs]
      }

      state.page = page
      state.totalPages = totalPages
      state.hasMore = hasNextPage
    })
    builder.addCase(getVideos.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // fetchVideoById
    builder.addCase(fetchVideoById.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchVideoById.fulfilled, (state, action: PayloadAction<Video>) => {
      state.loading = false
      state.currentVideo = action.payload
    })
    builder.addCase(fetchVideoById.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // publishVideo
    builder.addCase(publishVideo.pending, (state) => {
      state.uploadLoading = true
      state.error = null
    })
    builder.addCase(publishVideo.fulfilled, (state, action: PayloadAction<Video>) => {
      state.uploadLoading = false
      // Prepend new video to top of list
      state.videos = [action.payload, ...state.videos]
    })
    builder.addCase(publishVideo.rejected, (state, action) => {
      state.uploadLoading = false
      state.error = action.payload as string
    })

    // editVideo 
    builder.addCase(editVideo.pending, (state) => {
      state.uploadLoading = true
      state.error = null
    })
    builder.addCase(editVideo.fulfilled, (state, action: PayloadAction<Video>) => {
      state.uploadLoading = false
      const updated = action.payload
      // Update in list
      state.videos = state.videos.map((v) => (v._id === updated._id ? updated : v))
      // Update currentVideo if it's the same
      if (state.currentVideo?._id === updated._id) {
        state.currentVideo = updated
      }
    })
    builder.addCase(editVideo.rejected, (state, action) => {
      state.uploadLoading = false
      state.error = action.payload as string
    })

    // removeVideo 
    builder.addCase(removeVideo.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(removeVideo.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false
      state.videos = state.videos.filter((v) => v._id !== action.payload)
      if (state.currentVideo?._id === action.payload) {
        state.currentVideo = null
      }
    })
    builder.addCase(removeVideo.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    //togglePublish
    builder.addCase(togglePublish.pending, (state) => {
      state.error = null
      // no loading flag — it's a quick toggle, no skeleton needed
    })
    builder.addCase(togglePublish.fulfilled, (state, action: PayloadAction<Video>) => {
      const updated = action.payload
      state.videos = state.videos.map((v) => (v._id === updated._id ? updated : v))
      if (state.currentVideo?._id === updated._id) {
        state.currentVideo = updated
      }
    })
    builder.addCase(togglePublish.rejected, (state, action) => {
      state.error = action.payload as string
    })

    //incrementVideoViews
    builder.addCase(incrementVideoViews.fulfilled, (state, action: PayloadAction<string>) => {
      const videoId = action.payload
      // update views in list
      state.videos = state.videos.map((v) =>
        v._id === videoId ? { ...v, views: (v.views || 0) + 1 } : v
      )
      // update currentVideo
      if (state.currentVideo?._id === videoId) {
        state.currentVideo.views = (state.currentVideo.views || 0) + 1
      }
    })

    //likeVideo (cross-slice) 
    // likeVideo thunk lives in likeSlice but videoSlice listens to it here
    // When user likes a video → update isLiked + likesCount in both
    // the videos list AND currentVideo without refetching from server
    builder.addCase(toggleLikeOnVideo.fulfilled, (state, action) => {
      const { videoId, isLiked, likesCount } = action.payload
      // update in list (e.g. Home page video cards)
      state.videos = state.videos.map((v) =>
        v._id === videoId ? { ...v, isLiked, likesCount } : v
      )
      // update currentVideo (e.g. VideoPlayer page)
      if (state.currentVideo?._id === videoId) {
        state.currentVideo.isLiked = isLiked
        state.currentVideo.likesCount = likesCount
      }
    })
  },
})

export const { clearCurrentVideo, clearVideos, clearError } = videoSlice.actions
export default videoSlice.reducer