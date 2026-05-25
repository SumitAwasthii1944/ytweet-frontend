import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import uiReducer from "../features/uiSlice"
import videoReducer from "../features/videoSlice"
import commentReducer from '../features/commentSlice'
import likeReducer from '../features/likeSlice'
import tweetReducer from '../features/tweetSlice'
import playlistReducer from '../features/playlistSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    video:videoReducer,
    comments:commentReducer,
    likes:likeReducer,
    tweets:tweetReducer,
    playlists:playlistReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
