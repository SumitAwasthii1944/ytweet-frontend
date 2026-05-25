import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updateplaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist
} from "../api/playlist.api"

import type { Playlist, CreatePlaylistInput, UpdatePlaylistInput } from "../types"

//State

interface PlaylistState {
  playlists: Playlist[]
  currentPlaylist: Playlist | null
  loading: boolean
  error: string | null
}

const initialState: PlaylistState = {
  playlists: [],
  currentPlaylist: null,
  loading: false,
  error: null
}

//Async Thunks

export const createNewPlaylist = createAsyncThunk(
  "playlists/create",
  async (data: CreatePlaylistInput, { rejectWithValue }) => {
    try {
      const response = await createPlaylist(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create playlist"
      )
    }
  }
)

export const fetchUserPlaylists = createAsyncThunk(
  "playlists/fetchUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getUserPlaylists(userId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlists"
      )
    }
  }
)

export const fetchPlaylistById = createAsyncThunk(
  "playlists/fetchById",
  async (playlistId: string, { rejectWithValue }) => {
    try {
      const response = await getPlaylistById(playlistId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlist"
      )
    }
  }
)

export const updatePlaylistData = createAsyncThunk(
  "playlists/update",
  async (
    { data, playlistId }: { data: UpdatePlaylistInput; playlistId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateplaylist(data, playlistId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update playlist"
      )
    }
  }
)

export const deletePlaylistData = createAsyncThunk(
  "playlists/delete",
  async (playlistId: string, { rejectWithValue }) => {
    try {
      await deletePlaylist(playlistId)
      return playlistId
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete playlist"
      )
    }
  }
)

export const addVideoToPlaylistData = createAsyncThunk(
  "playlists/addVideo",
  async (
    { videoId, playlistId }: { videoId: string; playlistId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await addVideoToPlaylist(videoId, playlistId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add video to playlist"
      )
    }
  }
)

export const removeVideoFromPlaylistData = createAsyncThunk(
  "playlists/removeVideo",
  async (
    { videoId, playlistId }: { videoId: string; playlistId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await removeVideoFromPlaylist(videoId, playlistId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove video from playlist"
      )
    }
  }
)
export const fetchPlaylistVideos = createAsyncThunk(
  "playlists/fetchVideos",
  async () =>{
    
  }
)

// Slice 

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null
    }
  },
  extraReducers: (builder) => {
    // Create Playlist
    builder
      .addCase(createNewPlaylist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createNewPlaylist.fulfilled, (state, action) => {
        state.loading = false
        state.playlists.push(action.payload)
      })
      .addCase(createNewPlaylist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch User Playlists
    builder
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.loading = false
        state.playlists = action.payload
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch Playlist By ID
    builder
      .addCase(fetchPlaylistById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPlaylist = action.payload
      })
      .addCase(fetchPlaylistById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update Playlist
    builder
      .addCase(updatePlaylistData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePlaylistData.fulfilled, (state, action) => {
        state.loading = false
        state.currentPlaylist = action.payload
        const index = state.playlists.findIndex(
          (p) => p._id === action.payload._id
        )
        if (index !== -1) {
          state.playlists[index] = action.payload
        }
      })
      .addCase(updatePlaylistData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Delete Playlist
    builder
      .addCase(deletePlaylistData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePlaylistData.fulfilled, (state, action) => {
        state.loading = false
        state.playlists = state.playlists.filter((p) => p._id !== action.payload)
        if (state.currentPlaylist?._id === action.payload) {
          state.currentPlaylist = null
        }
      })
      .addCase(deletePlaylistData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Add Video to Playlist
    builder
      .addCase(addVideoToPlaylistData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addVideoToPlaylistData.fulfilled, (state, action) => {
        state.loading = false
        state.currentPlaylist = action.payload
        const index = state.playlists.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.playlists[index] = action.payload
      })
      .addCase(addVideoToPlaylistData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Remove Video from Playlist
    builder
      .addCase(removeVideoFromPlaylistData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeVideoFromPlaylistData.fulfilled, (state, action) => {
        state.loading = false
        state.currentPlaylist = action.payload
        const index = state.playlists.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.playlists[index] = action.payload
      })
      .addCase(removeVideoFromPlaylistData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, clearCurrentPlaylist } = playlistSlice.actions
export default playlistSlice.reducer
