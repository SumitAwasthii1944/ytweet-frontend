
import { useState } from "react"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import CommentCard from "./CommentCard"
import type { Comment } from "../../types"

interface CommentSectionProps {
    comments?: Comment[]
}

const CommentSection = ({ comments = [] }: CommentSectionProps) => {

    const [content, setContent] = useState("")

    const handleSubmit = () => {
        if (!content.trim()) return

        console.log("post comment:", content)

        setContent("")
    }

    return (
        <div className="flex flex-col gap-4">

            {/* Add Comment */}
            <div className="flex gap-3">

                <Avatar
                    src="/default.png"
                    alt="me"
                    size="sm"
                />

                <div className="flex flex-1 gap-2">

                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-transparent border border-white/10
                        rounded-lg px-3 py-2 text-sm text-white
                        focus:outline-none focus:border-violet-500"
                    />

                    <Button
                        size="sm"
                        onClick={handleSubmit}
                    >
                        Post
                    </Button>

                </div>

            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-3">

                {comments.length === 0 && (
                    <p className="text-zinc-500 text-sm">
                        No comments yet
                    </p>
                )}

                {comments.map((comment) => (
                    <CommentCard
                        key={comment._id}
                        comment={comment}
                    />
                ))}

            </div>

        </div>
    )
}

export default CommentSection
