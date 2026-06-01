
import Avatar from "../ui/Avatar"
import Glass from "../ui/Glass"
import type { Comment } from "../../types"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useState } from "react"
import { toggleCommentLike } from "../../api/like.api"
import { deleteComment, updateComment } from "../../api/comment.api"
import useAppDispatch from "../../hooks/useAppDispatch"
import { showToast } from "../../features/uiSlice"

interface CommentCardProps {
    comment: Comment
    onDelete?: (id: string) => void
    onUpdate?: (c: Comment) => void
}

const CommentCard = ({ comment, onDelete, onUpdate }: CommentCardProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [localIsLiked, setLocalIsLiked] = useState<boolean>(comment.isLiked)
    const [localLikesCount, setLocalLikesCount] = useState<number>(comment.likesCount || 0)
    const [working, setWorking] = useState(false)
    const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    })

    const handleLike = async () => {
        if (!user) {
            dispatch(showToast({ type: 'error', message: 'Please login to like comments' }))
            navigate('/login')
            return
        }
        if (working) return

        // optimistic
        const prevLiked = localIsLiked
        const prevCount = localLikesCount
        setLocalIsLiked(!prevLiked)
        setLocalLikesCount(prevLiked ? prevCount - 1 : prevCount + 1)
        setWorking(true)
        try {
            const res = await toggleCommentLike(comment._id)
            const updated: Comment = res.data
            // sync local state with server
            setLocalIsLiked(updated.isLiked)
            setLocalLikesCount(updated.likesCount)
            if (onUpdate) onUpdate(updated)
        } catch (err: any) {
            // rollback
            setLocalIsLiked(prevLiked)
            setLocalLikesCount(prevCount)
            dispatch(showToast({ type: 'error', message: err.message || 'Failed to toggle like' }))
        } finally {
            setWorking(false)
        }
    }

    const handleDelete = async () => {
        if (!user) {
            dispatch(showToast({ type: 'error', message: 'Please login' }))
            navigate('/login')
            return
        }
        if (String(comment.owner?._id) !== String(user._id)) {
            dispatch(showToast({ type: 'error', message: 'Unauthorized' }))
            return
        }
        if (!confirm('Delete this comment?')) return
        setWorking(true)
        try {
            const res = await deleteComment(comment._id)
            const deletedId = res.data.deletedId
            if (onDelete) onDelete(deletedId)
            dispatch(showToast({ type: 'success', message: 'Comment deleted' }))
        } catch (err: any) {
            dispatch(showToast({ type: 'error', message: err.message || 'Failed to delete comment' }))
        } finally {
            setWorking(false)
        }
    }

    const handleSaveEdit = async () => {
        if (editContent.trim() === '') return
        setWorking(true)
        try {
            const res = await updateComment(editContent.trim(), comment._id)
            const updated: Comment = res.data
            if (onUpdate) onUpdate(updated)
            setIsEditing(false)
            dispatch(showToast({ type: 'success', message: 'Comment updated' }))
        } catch (err: any) {
            dispatch(showToast({ type: 'error', message: err.message || 'Failed to update comment' }))
        } finally {
            setWorking(false)
        }
    }

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

                {!isEditing ? (
                    <>
                        <p className="text-zinc-300 text-sm mt-1">{comment.content}</p>

                        <div className="flex items-center gap-3 mt-2 text-sm">
                            <button onClick={handleLike} disabled={working} className="text-zinc-400 hover:text-white">
                                {localIsLiked ? 'Unlike' : 'Like'} ({localLikesCount})
                            </button>

                            {String(comment.owner?._id) === String(user?._id) && (
                                <>
                                    <button onClick={() => { setIsEditing(true); setEditContent(comment.content) }} className="text-zinc-400 hover:text-white">Edit</button>
                                    <button onClick={handleDelete} disabled={working} className="text-red-500">Delete</button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-2">
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="bg-transparent border border-white/10 rounded p-2" />
                        <div className="flex gap-2">
                            <button onClick={handleSaveEdit} disabled={working} className="px-3 py-1 bg-white text-black rounded">Save</button>
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1 border rounded">Cancel</button>
                        </div>
                    </div>
                )}

            </div>

        </Glass>
    )
}

export default CommentCard

