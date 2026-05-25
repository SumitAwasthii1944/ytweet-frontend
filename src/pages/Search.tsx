import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { getAllVideos } from "../api/video.api"
import { getUserTweets } from "../api/tweet.api"
import { searchUsers } from "../api/user.api"
import TweetCard from "../components/tweet/TweetCard"
import VideoCard from "../components/video/VideoCard"
import Glass from "../components/ui/Glass"
import Spinner from "../components/ui/Spinner"
import Avatar from "../components/ui/Avatar"
import type { Video, Tweet, User } from "../types"

type Tab = "all" | "videos" | "tweets" | "users"

const Search = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q") || ""

    const [activeTab, setActiveTab] = useState<Tab>("all")
    const [videos, setVideos] = useState<Video[]>([])
    const [tweets, setTweets] = useState<Tweet[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query.trim()) return

        const fetchResults = async () => {
            setLoading(true)
            try {
                // fetch all three in parallel
                const [videoRes, tweetRes, userRes] = await Promise.all([
                    getAllVideos({ query, limit: 10 }),
                    getUserTweets({ query, limit: 10 }),
                    searchUsers(query)
                ])
                setVideos(videoRes.data?.docs || [])
                setTweets(tweetRes.data?.docs || [])
                setUsers(userRes.data || [])
            } catch (err) {
                console.error("Search error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])  // re-fetch when query changes

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: "all",    label: "All",    count: videos.length + tweets.length + users.length },
        { key: "videos", label: "Videos", count: videos.length },
        { key: "tweets", label: "Tweets", count: tweets.length },
        { key: "users",  label: "Users",  count: users.length  },
    ]

    if (!query) {
        return (
            <div className="flex justify-center py-20">
                <p className="text-zinc-500">Search for videos, tweets or users</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto py-4">

            {/* ── Search query header ── */}
            <Glass>
                <p className="text-zinc-400 text-sm">
                    Results for <span className="text-white font-semibold">"{query}"</span>
                </p>
            </Glass>

            {/* ── Tabs ── */}
            <div className="flex gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium
                            border transition-colors duration-200
                            ${activeTab === tab.key
                                ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                                : "text-zinc-400 border-white/10 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-1 text-xs text-zinc-500">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Results ── */}

            {/* Users */}
            {(activeTab === "all" || activeTab === "users") && users.length > 0 && (
                <div className="flex flex-col gap-2">
                    {activeTab === "all" && (
                        <h2 className="text-white font-semibold text-sm px-1">People</h2>
                    )}
                    {users.map(user => (
                        <Link to={`/profile/${user.username}`}>
                            <Glass key={user._id} className="flex items-center gap-3">
                                <Avatar src={user.avatar} alt={user.username} size="md" />
                                <div className="flex flex-col">
                                    <span className="text-white text-sm font-semibold">
                                        {user.fullName}
                                    </span>
                                    <span className="text-zinc-400 text-xs">
                                        @{user.username}
                                    </span>
                                </div>
                            </Glass>
                        </Link>
                    ))}
                </div>
            )}

            {/* Videos */}
            {(activeTab === "all" || activeTab === "videos") && videos.length > 0 && (
                <div className="flex flex-col gap-2">
                    {activeTab === "all" && (
                        <h2 className="text-white font-semibold text-sm px-1">Videos</h2>
                    )}
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}

            {/* Tweets */}
            {(activeTab === "all" || activeTab === "tweets") && tweets.length > 0 && (
                <div className="flex flex-col gap-2">
                    {activeTab === "all" && (
                        <h2 className="text-white font-semibold text-sm px-1">Tweets</h2>
                    )}
                    {tweets.map(tweet => (
                        <TweetCard key={tweet._id} tweet={tweet} />
                    ))}
                </div>
            )}

            {/* No results */}
            {!loading && videos.length === 0 && tweets.length === 0 && users.length === 0 && (
                <div className="flex justify-center py-10">
                    <p className="text-zinc-500 text-sm">
                        No results found for "{query}"
                    </p>
                </div>
            )}

        </div>
    )
}

export default Search