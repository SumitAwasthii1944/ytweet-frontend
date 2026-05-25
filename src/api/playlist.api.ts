import axiosInstance from "./axios";
import type {
          ApiResponse,
          CreatePlaylistInput,
          UpdatePlaylistInput,
          Playlist

} from '../types'

export const createPlaylist = async (data:CreatePlaylistInput) => {
          const res = await axiosInstance.post<ApiResponse<Playlist>>(
                    '/playlist',
                    data
          )
          return res.data
}

export const getUserPlaylists = async (userId:string) => {
          const res=await axiosInstance.get<ApiResponse<Playlist[]>>(
                    `/playlist/user/${userId}`
          )
          return res.data
}
export const getDashboardPlaylists =async () =>{
          const res=await axiosInstance.get<ApiResponse<Playlist[]>>(
                    `/playlist/dashboard`
          )
          return res.data
}

export const getPlaylistById = async (playlistId:string) =>{
          const res = await axiosInstance.get<ApiResponse<Playlist>>(
                    `/playlist/${playlistId}`
          )
          return res.data
}

export const updateplaylist = async (data:UpdatePlaylistInput,playlistId:string) => {
          const res = await axiosInstance.patch<ApiResponse<Playlist>>(
                    `/playlist/${playlistId}`,
                    data
          )
          return res.data
}

export const deletePlaylist = async (playlistId:string) => {
          const res = await axiosInstance.delete<ApiResponse<{}>>(
                    `/playlist/${playlistId}`
          )
          return res.data
}

export const removeVideoFromPlaylist = async (videoId:string,playlistId:string) => {
          const res = await axiosInstance.patch<ApiResponse<Playlist>>(
                    `/playlist/remove/${videoId}/${playlistId}`
          )
          return res.data
}

export const addVideoToPlaylist = async (videoId:string,playlistId:string) => {
          const res = await axiosInstance.patch<ApiResponse<Playlist>>(
                    `/playlist/add/${videoId}/${playlistId}`
          )
          return res.data
}
