import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { updateTweet, getUserTweets, deleteTweet, createTweet } from '../api/tweet.api'
import { toggleLikeOnTweet } from './likeSlice'
import type {
    TweetQueryParams,
    Tweet,
    TweetsPaginated,
    UpdateTweetInput,
    CreateTweetInput
} from "../types"


interface TweetState {
    tweets: Tweet[]
    loading: boolean
    uploadLoading: boolean  // separate loader for post/edit actions
    error: string | null
    // pagination
    hasMore: boolean
    page: number
    totalPages: number
}

const initialState: TweetState = {
    tweets: [],
    loading: false,
    uploadLoading: false,
    error: null,
    // pagination
    hasMore: true,
    page: 1,
    totalPages: 1,
}


// POST a new tweet
export const postTweet = createAsyncThunk(
    "tweets/postTweet",
    async (data: CreateTweetInput, { rejectWithValue }) => {
        try {
            const res = await createTweet(data)
            return res.data as Tweet
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create tweet")
        }
    }
)

// EDIT an existing tweet
export const editTweet = createAsyncThunk(
    "tweets/editTweet",
    async ({ data, tweetId }: { data: UpdateTweetInput; tweetId: string }, { rejectWithValue }) => {
        try {
            const res = await updateTweet(data, tweetId)
            return res.data as Tweet
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to edit tweet")
        }
    }
)

// DELETE a tweet
export const removeTweet = createAsyncThunk(
    "tweets/removeTweet",
    async (tweetId: string, { rejectWithValue }) => {
        try {
            await deleteTweet(tweetId)
            return tweetId  // return id so we can remove it from state
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove tweet")
        }
    }
)

// GET tweets (all users or specific user via userId query param)
// GET /api/v1/tweets               all tweets public feed
// GET /api/v1/tweets?userId=abc123 -specific user's tweets
export const getTweets = createAsyncThunk(
    "tweets/getTweets",
    async (params: TweetQueryParams, { rejectWithValue }) => {
        try {
            const res = await getUserTweets(params)
            return res.data as TweetsPaginated
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to get tweets")
        }
    }
)

const tweetSlice = createSlice({
    name: "tweets",
    initialState,
    reducers: {
        // call this before fetching page 1 (e.g. on component mount or filter change)
        // resets list so old tweets don't show while new ones load
        clearTweets: (state) => {
            state.tweets = []
            state.page = 1
            state.hasMore = true
            state.totalPages = 1
            state.error = null
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {

        builder.addCase(getTweets.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getTweets.fulfilled, (state, action: PayloadAction<TweetsPaginated>) => {
            state.loading = false
            const { docs, totalPages, hasNextPage, page } = action.payload

            if (page === 1) {
                // fresh fetch — replace entire list
                // happens on first load or after clearTweets()
                state.tweets = docs
            } else {
                // pagination — append new tweets to existing list
                // avoids duplicates by filtering out any tweet already in state
                const existingIds = new Set(state.tweets.map(t => t._id))
                const newTweets = docs.filter(t => !existingIds.has(t._id))
                state.tweets = [...state.tweets, ...newTweets]
            }

            state.page = page
            state.totalPages = totalPages
            state.hasMore = hasNextPage
        })
        builder.addCase(getTweets.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        // uploadLoading keeps the main feed loading state clean
        // new tweet is prepended so it appears at the top immediately
        builder.addCase(postTweet.pending, (state) => {
            state.uploadLoading = true
            state.error = null
        })
        builder.addCase(postTweet.fulfilled, (state, action: PayloadAction<Tweet>) => {
            state.uploadLoading = false
            state.tweets.unshift(action.payload) // prepend — newest first
        })
        builder.addCase(postTweet.rejected, (state, action) => {
            state.uploadLoading = false
            state.error = action.payload as string
        })


        // find the tweet in state by id and replace it with updated version
        builder.addCase(editTweet.pending, (state) => {
            state.uploadLoading = true
            state.error = null
        })
        builder.addCase(editTweet.fulfilled, (state, action: PayloadAction<Tweet>) => {
            state.uploadLoading = false
            const index = state.tweets.findIndex(t => t._id === action.payload._id)
            if (index !== -1) {
                // preserve isLiked and totalLikes since edit doesn't affect them
                state.tweets[index] = {
                    ...state.tweets[index],
                    ...action.payload
                }
            }
        })
        builder.addCase(editTweet.rejected, (state, action) => {
            state.uploadLoading = false
            state.error = action.payload as string
        })


        // filter out the deleted tweet from state by id
        builder.addCase(removeTweet.pending, (state) => {
            state.uploadLoading = true
            state.error = null
        })
        builder.addCase(removeTweet.fulfilled, (state, action: PayloadAction<string>) => {
            state.uploadLoading = false
            state.tweets = state.tweets.filter(t => t._id !== action.payload)
            // payload is the tweetId we returned from the thunk
        })
        builder.addCase(removeTweet.rejected, (state, action) => {
            state.uploadLoading = false
            state.error = action.payload as string
        })


        // TOGGLE LIKE 
        // toggleLikeOnTweet lives in likeSlice but we listen to it here
        // so tweetSlice stays in sync without a separate API call
        //
        // what likeSlice returns on fulfilled:
        // { tweetId, isLiked: !isLiked, totalLikes: updated count }
        //
        // we find the tweet in state and update its isLiked + totalLikes
        builder.addCase(toggleLikeOnTweet.fulfilled, (state, action) => {
            const { tweetId, isLiked, totalLikes } = action.payload
            const tweet = state.tweets.find(t => t._id === tweetId)
            if (tweet) {
                tweet.isLiked = isLiked
                tweet.totalLikes = totalLikes
            }
        })
        // on rejected — likeSlice already handles the error
        // we do optimistic update reversal here if you add optimistic updates later
        builder.addCase(toggleLikeOnTweet.rejected, (state, action) => {
            state.error = action.payload as string
        })
    }
})

export const { clearTweets, clearError } = tweetSlice.actions
export default tweetSlice.reducer