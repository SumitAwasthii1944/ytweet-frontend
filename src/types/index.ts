// ─── API RESPONSE WRAPPER ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
    statusCode: number
    data: T
    message: string
    success: boolean
}

// ─── USER ─────────────────────────────────────────────────────────────────────
export interface User {
    _id: string
    username: string
    fullName: string
    email: string
    avatar: string
    coverImage?: string
    watchHistory?: string[]
    createdAt: string
    updatedAt: string
}

// ─── VIDEO ────────────────────────────────────────────────────────────────────
export interface Video {
    _id: string
    title: string
    description: string
    videoFile: string
    thumbnail: string
    views: number
    duration: number
    isPublished: boolean
    owner: User
    createdAt: string
    updatedAt: string
    likesCount?: number
    isLiked?: boolean
}

export interface DashboardChannelVideo {
    _id: string
    videoFile: string
    thumbnail: string
    title: string
    description: string
    views: number
    duration: number
    createdAt: string
    isPublished: boolean
    likesCount: number   //extra field from $addFields
}
export interface DashboardChannelTweet {
    _id: string
    media: string
    title: string
    content: string
    createdAt: string
    likesCount: number   //extra field from $addFields
}

// paginated response from aggregatePaginate
export interface VideosPaginated {
    docs: Video[]
    totalDocs: number
    limit: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
    views?:number
    totalLikes?:number
}

// ─── TWEET ────────────────────────────────────────────────────────────────────
export interface Tweet {
    _id: string
    title: string
    content: string
    media?: string
    owner: User
    totalLikes: number
    isLiked: boolean
    createdAt: string
    updatedAt: string
}

export interface TweetsPaginated {
    docs: Tweet[]
    totalDocs: number
    limit: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
}

// ─── COMMENT ──────────────────────────────────────────────────────────────────
export interface Comment {
    _id: string
    content: string
    video: string
    owner: User
    likesCount: number
    isLiked: boolean
    createdAt: string
    updatedAt: string
}

export interface CommentsPaginated {
    docs: Comment[]
    totalDocs: number
    limit: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
}

// ─── LIKE ─────────────────────────────────────────────────────────────────────
export interface Like {
    _id: string
    video?: string
    comment?: string
    tweet?: string
    likedBy: string
    createdAt: string
    updatedAt: string
}

// ─── SUBSCRIPTION ─────────────────────────────────────────────────────────────
export interface Subscription {
    _id: string
    subscriber: string
    channel: string
    createdAt: string
    updatedAt: string
}

// subscribed channel response from getSubscribedChannels
export interface SubscribedChannel {
    _id: string
    fullName: string
    username: string
    avatar: string
    email: string
}
export interface ToggleSubscriptionResponse {
    subscribed: boolean
}
// channel subscribers response from getUserChannelSubscribers
export interface ChannelSubscriber {
    _id: string
    fullName: string
    username: string
    avatar: string
    email: string
}

// ─── PLAYLIST ─────────────────────────────────────────────────────────────────
export interface Playlist {
    _id: string
    name: string
    description: string
    videos: Video[]
    thumbnail?: string
    owner: User
    createdAt: string
    updatedAt: string
}


// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export interface ChannelStats {
    totalVideos: number
    totalViews: number
    totalLikes: number
    totalSubscribers: number
}

// ─── CHANNEL PROFILE ──────────────────────────────────────────────────────────
// response from getUserChannelProfile in user controller
export interface ChannelProfile {
    _id: string
    username: string
    fullName: string
    email: string
    avatar: string
    coverImage?: string
    subscribersCount: number
    channelsSubscribedToCount: number
    isSubscribed: boolean
    createdAt: string
    updatedAt: string
}

// ─── WATCH HISTORY ────────────────────────────────────────────────────────────
export interface WatchHistory extends Video {
    owner: User
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export interface LoginInput {
    email?: string
    username?: string
    password: string
}

export interface RegisterInput {
    username: string
    fullName: string
    email: string
    password: string
    avatar:FileList,
    coverImage?:FileList | null
}

// ─── FORM INPUTS ──────────────────────────────────────────────────────────────
export interface CreateTweetInput {
    title: string
    content: string
    media?: File
}

export interface UpdateTweetInput {
    title?: string
    content?: string
    media?: File
}

export interface CreatePlaylistInput {
    name: string
    description: string
}

export interface UpdatePlaylistInput {
    name?: string
    description?: string
}

export interface PublishVideoInput {
    title: string
    description: string
    videoFile: File
    thumbnail: File
    isPublished?: boolean
}

export interface UpdateVideoInput {
    title?: string
    description?: string
    thumbnail?: File
}

export interface UpdateAccountInput {
    fullName?: string
    email?: string
}

export interface ChangePasswordInput {
    oldPassword: string
    newPassword: string
}

// ─── QUERY PARAMS ─────────────────────────────────────────────────────────────
export interface VideoQueryParams {
    page?: number
    limit?: number
    query?: string
    sortBy?: string
    sortType?: "asc" | "desc"
    userId?: string
}

export interface TweetQueryParams {
    page?: number
    limit?: number
    query?: string
    sortBy?: string
    sortType?: "asc" | "desc"
    userId?: string
}

export interface CommentQueryParams {
    page?: number
    limit?: number
}