import { useEffect } from "react"
import TweetCard from "./TweetCard"
import Spinner from "../ui/Spinner"
import { useTweets } from "../../hooks/useTweets"
import useInfiniteScroll from "../../hooks/useInfiniteScroll"
import type { Tweet } from "../../types"

interface TweetListProps {
    showActions?: boolean
    onEdit?: (tweet: Tweet) => void
    onDelete?: (tweetId: string) => void
}

const TweetList = ({
    showActions = false,
    onEdit,
    onDelete
}: TweetListProps) => {
    const { tweets, loading, hasMore, fetchTweets, resetTweets, page } = useTweets()

    // fetch page 1 on mount
    useEffect(() => {
        resetTweets()
        fetchTweets({ page: 1, limit: 10 })
    }, [])

    // load next page when sentinel is visible
    const loadMore = () => {
        if (hasMore && !loading) {
            fetchTweets({ page: page + 1, limit: 10 })
        }
    }

    const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading)

    // initial loading
    if (loading && tweets.length === 0) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        )
    }

    // empty state
    if (!loading && tweets.length === 0) {
        return (
            <div className="flex justify-center py-10">
                <p className="text-zinc-500 text-sm">No tweets yet</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3 border-white/10 bg-slate-950/70 rounded-xl p-4 lg:ml-40 max-w-3xl">

            {tweets.map(tweet => (
                <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}

            {/* sentinel — invisible div at bottom, triggers loadMore when visible */}
            <div ref={sentinelRef} />

            {/* loading more */}
            {loading && tweets.length > 0 && (
                <div className="flex justify-center py-4">
                    <Spinner />
                </div>
            )}

            {/* end of feed */}
            {!hasMore && tweets.length > 0 && (
                <p className="text-center text-zinc-600 text-xs py-4">
                    You've reached the end
                </p>
            )}

        </div>
    )
}

export default TweetList