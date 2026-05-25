
import { useState } from "react"
import Glass from "../ui/Glass"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import { useLike } from "../../hooks/useLike"
import type { Tweet } from "../../types"
import { Link } from "react-router-dom"

interface TweetCardProps {
    tweet: Tweet
    showActions?: boolean
    onEdit?: (tweet: Tweet) => void
    onDelete?: (tweetId: string) => void
}

const TweetCard = ({
    tweet,
    showActions = false,
    onEdit,
    onDelete
}: TweetCardProps) => {

    const { toggleTweetLike } = useLike()
    const [isExpanded, setIsExpanded] = useState(false)

    // truncate content after 200 chars — show "...more"
    const isLong = tweet.content.length > 200
    const displayContent = isExpanded || !isLong
        ? tweet.content
        : tweet.content.slice(0, 200)

    const formattedDate = new Date(tweet.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })

    const handleLike = () => {
        toggleTweetLike({
            tweetId: tweet._id,
            isLiked: tweet.isLiked,
            totalLikes: tweet.totalLikes
        })
    }

    return (
        <Glass className="w-full flex flex-col p-2 rounded-lg  gap-3">

            {/* Top Row -> Avatar + Name + Date + Actions */}
            <div className="flex items-start justify-between">

                {/* Avatar + Name + username + date */}
                <div className="flex items-center gap-3">
                    <Link
                        to={`/profile/${tweet?.owner?.username}`}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <Avatar
                            src={tweet?.owner?.avatar || "/default.png"}
                            alt={tweet?.owner?.username || "user"}
                            size="md"
                        />
                        <div className="flex flex-col">
                            <span className="text-white font-semibold text-sm leading-tight">
                                {tweet?.owner?.fullName || "Unknown"}
                            </span>
                            <span className="text-zinc-400 text-xs">
                                @{tweet?.owner?.username || "unknown"}
                            </span>
                            <span className="text-zinc-500 text-xs">
                                {formattedDate}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* edit/delete — only on my tweets page */}
                {showActions && (
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            onClick={() => onEdit?.(tweet)}
                            className="text-zinc-400 hover:text-white"
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onDelete?.(tweet._id)}
                            className="text-red-400 hover:text-red-300"
                        >
                            Delete
                        </Button>
                    </div>
                )}

            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-base">
                {tweet.title}
            </h3>

            {/* Content with expand/collapse */}
            <p className="text-zinc-300 text-sm leading-relaxed">
                {displayContent}
                {isLong && !isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="text-zinc-400 hover:text-white ml-1 text-sm"
                    >
                        ...more
                    </button>
                )}
            </p>

            {/* Media */}
            {tweet.media && (
                <div className="-mx-3 -mt-1 p-2">
                    <img
                        src={tweet.media}
                        alt="tweet media"
                        className="w-full object-cover"
                    />
                </div>
            )}

            {/* Like count */}
            {tweet.totalLikes > 0 && (
                <div>
                    <span className="text-white text-xs">
                        ❤️ {tweet.totalLikes}
                    </span>
                </div>
            )}

            {/* Like Button */}
            <div className="flex items-center justify-center border-t border-white/10 -mx-3 -mb-3">

                <button
                    onClick={handleLike}
                    className={`flex items-center justify-center gap-2 py-3 px-6
                        text-sm font-medium transition-colors duration-200
                        hover:bg-white/5 rounded-md
                        ${tweet.isLiked
                            ? "text-red-500"
                            : "text-zinc-400 hover:text-white"
                        }`}
                >
                    <span className="text-lg">
                        {tweet.isLiked ? "❤️" : "🤍"}
                    </span>
                    <span>Like</span>
                </button>

            </div>

        </Glass>
    )
}

export default TweetCard

