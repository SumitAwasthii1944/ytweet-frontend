
import Avatar from "../ui/Avatar"
import Glass from "../ui/Glass"
import type { Comment } from "../../types"
import { Link } from "react-router-dom"

interface CommentCardProps {
    comment: Comment
}

const CommentCard = ({ comment }: CommentCardProps) => {

    const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    })

    return (
        <Glass className="flex gap-3 p-3">

            <Link to={`/profile/${comment.owner?.username}`}>
                <Avatar
                    src={comment.owner?.avatar || "/default.png"}
                    alt={comment.owner?.username}
                    size="sm"
                />
            </Link>

            <div className="flex flex-col flex-1">

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-white font-semibold">
                        {comment.owner?.fullName}
                    </span>

                    <span className="text-zinc-400">
                        @{comment.owner?.username}
                    </span>

                    <span className="text-zinc-500">
                        {formattedDate}
                    </span>
                </div>

                <p className="text-zinc-300 text-sm mt-1">
                    {comment.content}
                </p>

            </div>

        </Glass>
    )
}

export default CommentCard

