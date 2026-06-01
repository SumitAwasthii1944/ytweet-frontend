
import { useEffect, useState } from "react"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import CommentCard from "./CommentCard"
import type { Comment } from "../../types"
import { getVideoComments, addComment } from "../../api/comment.api"
import useAppDispatch from "../../hooks/useAppDispatch"
import { showToast } from "../../features/uiSlice"
import { useAuth } from "../../hooks/useAuth"

interface CommentSectionProps {
    videoId: string
}

const CommentSection = ({ videoId }: CommentSectionProps) => {
    const dispatch = useAppDispatch()
    const [comments, setComments] = useState<Comment[]>([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [posting, setPosting] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [total, setTotal] = useState(0)
    const [sortBy, setSortBy] = useState<"newest" | "top">("newest")
    const {user} =useAuth()
    const avatar=user?.avatar

    const fetchComments = async (p = 1) => {
        setLoading(true)
        try {
            // getVideoComments returns ApiResponse<CommentsPaginated>
            const apiRes = await getVideoComments({ page: p, limit: 10 }, videoId)
            const data = apiRes.data

            // avoid mutating the server response directly — work on a copy for client-side sorting
            let docs = data.docs || []
            if (sortBy === 'top') {
                docs = [...docs].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
            }

            if (p === 1) setComments(docs)
            else setComments(prev => [...prev, ...docs])

            setPage(data.page)
            setHasMore(data.hasNextPage)
            setTotal(data.totalDocs)
        } catch (err: any) {
            dispatch(showToast({ type: 'error', message: err.message || 'Failed to load comments' }))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!videoId) return
        fetchComments(1)
    }, [videoId, sortBy])

    const handleSubmit = async () => {
        if (!content.trim()) return
        setPosting(true)
        try {
            const res = await addComment(content.trim(), videoId)
            // prepend the new comment
            setComments(prev => [res.data, ...prev])
            setTotal(prev => prev + 1)
            setContent("")
            dispatch(showToast({ type: 'success', message: 'Comment posted' }))
        } catch (err: any) {
            dispatch(showToast({ type: 'error', message: err.message || 'Failed to post comment' }))
        } finally {
            setPosting(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">

            {/* Header: count + sort */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <p className="text-sm text-zinc-500">{total} comments</p>
                </div>
                <div>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-gray-500 border border-white/10 rounded px-3 py-1 text-sm">
                        <option value="newest">Newest</option>
                        <option value="top">Top</option>
                    </select>
                </div>
            </div>

            {/* Add Comment */}
            <div className="flex gap-3">
                <Avatar src={`${avatar}`}alt="me" size="sm" />
                <div className="flex flex-1 gap-2">
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add a public comment..."
                        className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                    <Button size="sm" onClick={handleSubmit} disabled={posting}>{posting ? 'Posting...' : 'Comment'}</Button>
                </div>
            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-3">
                {loading && <p className="text-sm text-zinc-500">Loading comments...</p>}

                {comments.length === 0 && !loading && (
                    <p className="text-zinc-500 text-sm">No comments yet</p>
                )}

                {comments.map((comment) => (
                    <CommentCard
                        key={comment._id}
                        comment={comment}
                        onUpdate={(updated) => setComments(prev => prev.map(c => c._id === updated._id ? updated : c))}
                        onDelete={(deletedId) => { setComments(prev => prev.filter(c => c._id !== deletedId)); setTotal(prev => prev - 1) }}
                    />
                ))}

                {hasMore && (
                    <div className="flex justify-center">
                        <Button size="sm" onClick={() => fetchComments(page + 1)}>Load more</Button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default CommentSection
