import { useCallback } from "react"
import {clearCurrentVideo, clearError} from "../features/videoSlice";
import {
          getVideos,
          fetchVideoById,
          publishVideo,
          editVideo,
          removeVideo,
          togglePublish,
          incrementVideoViews,
          clearVideos
} from '../features/videoSlice'

import type {
          PublishVideoInput,
          UpdateVideoInput,
          VideoQueryParams
} from '../types'
import useAppDispatch from "./useAppDispatch";
import useAppSelector from "./useAppSelector";

export const useVideos = () => {
          const {videos,currentVideo,loading, uploadLoading,error,hasMore} = useAppSelector(State => State.video)
          const dispatch =useAppDispatch()

          const fetchVideos = useCallback((params:VideoQueryParams) => {
                    return dispatch(getVideos(params))
          }, [dispatch])

          const removeVideos = useCallback(() => {
                    dispatch(clearVideos())
          },[dispatch])

          const getVideoById = useCallback((videoId:string) => {
                    return dispatch(fetchVideoById(videoId))
          }, [dispatch])

          const publishAVideo = useCallback((data:PublishVideoInput) => {
                    return dispatch(publishVideo(data))
          }, [dispatch])

          const updateVideo = useCallback((data:UpdateVideoInput,videoId:string) => {
                    return dispatch(editVideo({data,videoId}))
          }, [dispatch])

          const deleteVideo = useCallback((videoId:string) => {
                    return dispatch(removeVideo(videoId))
          }, [dispatch])

          const toggleVideoPublish = useCallback((videoId:string) => {
                    return dispatch(togglePublish(videoId))
          }, [dispatch])

          const incrementViews = useCallback((videoId:string) => {
                    return dispatch(incrementVideoViews(videoId))
          }, [dispatch])

          return {
                    videos,
                    currentVideo,
                    loading, 
                    uploadLoading,
                    error,
                    hasMore,
                    fetchVideos,
                    getVideoById,
                    updateVideo,
                    deleteVideo,
                    publishAVideo,
                    toggleVideoPublish,
                    incrementViews,
                    removeVideos
          }
}