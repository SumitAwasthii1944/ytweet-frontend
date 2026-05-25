import { createAsyncThunk,createSlice,type PayloadAction } from "@reduxjs/toolkit";
import { toggleLikeOnComment } from "./likeSlice"
import {
          getVideoComments,
          addComment,
          deleteComment,
          updateComment
} from "../api/comment.api"

import type {
          Comment,
          CommentQueryParams,
          CommentsPaginated
} from '../types'

interface commentState {
          comments:Comment[]
          loading:boolean
          isLiked:boolean
          likesCount:number
          actionLoading:boolean
          page:number
          totalPages:number
          hasMore:boolean
          error:string | null
}

const initialState:commentState = {
          comments:[],
          loading:false,
          isLiked:false,
          likesCount:0,
          actionLoading:false,
          page:1,
          totalPages:1,
          hasMore:true,
          error:null
}

export const getComments = createAsyncThunk(
          'comments/getComments',
          async ({params,videoId}:{params:CommentQueryParams,videoId:string},{rejectWithValue}) => {
                    try {
                              const res = await getVideoComments(params,videoId)
                              return res.data as CommentsPaginated
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to fetch comments")
                    }
          }
)

export const postComment =createAsyncThunk(
          'comments/postComment',
          async ({content,videoId}:{content:string,videoId:string},{rejectWithValue}) => {
                    try {
                              const res=await addComment(content,videoId);
                              return res.data
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to post comment")
                    }
          }
)
export const editComment =createAsyncThunk(
          'comments/editComment',
          async ({content,commentId}:{content:string,commentId:string},{rejectWithValue}) => {
                    try {
                              const res=await updateComment(content,commentId);
                              return res.data
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to edit comment")
                    }
          }
)

export const removeComment =createAsyncThunk(
          'comments/removeComment',
          async (commentId:string,{rejectWithValue}) => {
                    try {
                              const res=await deleteComment(commentId);
                              return commentId
                    } catch (error:any) {
                              return rejectWithValue(error.response?.data?.message || "failed to delete comment")
                    }
          }
)

const commentSlice = createSlice({
          name:"comments",
          initialState,
          reducers:{
                    clearComment:(state) => {
                              state.comments=[],
                              state.page=1,
                              state.hasMore=true,
                              state.totalPages=1
                    },
                    clearError:(state) => {
                              state.error=null
                    }
          },
          extraReducers:(builder) => {
                    //getComments
                    builder.addCase(getComments.pending,(state) => {
                              state.loading=true
                              state.error=null
                    })
                    builder.addCase(getComments.fulfilled,(state,action:PayloadAction<CommentsPaginated>) => {
                              state.loading=false
                              const {docs, page, totalPages, hasNextPage} = action.payload 
                              if(page == 1){
                                        state.comments=docs
                              }else{
                                        state.comments=[...state.comments,...docs]
                              }
                              state.page=page
                              state.totalPages=totalPages
                              state.hasMore=hasNextPage
                    })
                    builder.addCase(getComments.rejected, (state, action) => {
                              state.loading = false
                              state.error = action.payload as string
                    })
                    //postComments
                    builder.addCase(postComment.pending,(state) => {
                              state.actionLoading=true
                              state.error=null
                    })
                    builder.addCase(postComment.fulfilled,(state,action:PayloadAction<Comment>) => {
                              state.actionLoading=true
                              state.comments=[action.payload,...state.comments]
                    })
                    builder.addCase(postComment.rejected,(state,action) => {
                              state.actionLoading=false
                              state.error=action.payload as string
                    })
                    //editComments
                    builder.addCase(editComment.pending,(state) => {
                              state.actionLoading=true
                              state.error=null
                    })
                    builder.addCase(editComment.fulfilled,(state,action:PayloadAction<Comment>) => {
                              state.actionLoading=false
                              const updated=action.payload
                              state.comments=state.comments.map((comment) => (comment._id === updated._id ? updated : comment))
                    })
                    builder.addCase(editComment.rejected, (state, action) => {
                              state.actionLoading = false
                              state.error = action.payload as string
                    })
                    //removeComment
                    builder.addCase(removeComment.pending,(state) => {
                              state.actionLoading=true
                              state.error=null
                    })
                    builder.addCase(removeComment.fulfilled,(state,action:PayloadAction<string>) => {
                              state.actionLoading=false
                              const remove=action.payload
                              state.comments=state.comments.filter((comment) => (comment._id !== remove))
                    })
                    builder.addCase(removeComment.rejected, (state, action) => {
                              state.actionLoading = false
                              state.error = action.payload as string
                    })
                    
                    //crossslice for likes
                    builder.addCase(toggleLikeOnComment.fulfilled, (state, action) => {
                              const { commentId, isLiked, likesCount } = action.payload
                              state.comments = state.comments.map((c) =>
                              c._id === commentId ? { ...c, isLiked, likesCount } : c
                              )
                    })

          }
})
export const { clearComment, clearError } = commentSlice.actions
export default commentSlice.reducer