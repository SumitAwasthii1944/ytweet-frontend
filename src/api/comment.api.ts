import axiosInstance from "./axios";
import  type {
          CommentQueryParams,
          CommentsPaginated,
          Comment,
          ApiResponse
} from '../types'
//GET — no body, params go in URL
//axiosInstance.get("/comments/123", { params })
//-> /comments/123?page=1&limit=10
// params is axios config — converts to query string

//POST with object — send as body directly
//axiosInstance.post("/users/login", data)
// → body: { email: "...", password: "..." }
// data IS the body — no wrapping needed

//POST with string — wrap in object first
//axiosInstance.post("/comments/123", { content })
// → body: { content: "hello" }
// content is string so wrap it in object

export const getVideoComments = async (params:CommentQueryParams,videoId:string) => {
          const res = await axiosInstance.get<ApiResponse<CommentsPaginated>>(
                    `/comments/${videoId}`,
                    {
                              params
                    }
          )
          return res.data
}

export const addComment = async (content:string,videoId:string) => {
          const res = await axiosInstance.post<ApiResponse<Comment>>(
                    `/comments/${videoId}`,
                    {content}
          )
          return res.data
}

export const deleteComment = async (commentId:string) => {
          const res = await axiosInstance.delete<ApiResponse<{ deletedId: string }>>(
                    `/comments/c/${commentId}`,
          )
          return res.data
}

export const updateComment = async (content:string,commentId:string) => {
          const res = await axiosInstance.patch<ApiResponse<Comment>>(
                    `/comments/c/${commentId}`,
                    { content }
          )
          return res.data
}