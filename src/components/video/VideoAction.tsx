import { useState } from "react"
import { Link } from "react-router-dom"
import { useLike } from "../../hooks/useLike"
import useAppDispatch from "../../hooks/useAppDispatch"
import type { Video } from "../../types"
import { showToast } from "../../features/uiSlice"
import AddToPlaylistModal from "../playlist/AddToPlaylistModal"

interface VideoActionProps {
  video: Video
}

const VideoAction = ({ video }: VideoActionProps) => {
  const dispatch = useAppDispatch()
  const { toggleVideoLike } = useLike()
  const [isLiked, setIsLiked] = useState(video.isLiked || false)
  const [likesCount, setLikesCount] = useState(video.likesCount || 0)
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false)

  const handleLike = () => {
    const newIsLiked = !isLiked
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1

    setIsLiked(newIsLiked)
    setLikesCount(newLikesCount)

    toggleVideoLike({
      videoId: video._id,
      isLiked: newIsLiked,
      likesCount: newLikesCount
    })
  }

  const handleShare = () => {
    const url = `${window.location.origin}/watch/${video._id}`
    navigator.clipboard.writeText(url).then(() => {
      dispatch(showToast({ type: "success", message: "Video URL copied" }))
    })
  }

  return (
    <>
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isLiked
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-slate-900/70 text-slate-200 border border-white/10 hover:bg-slate-800/70"
          }`}
        >
          <span>{isLiked ? "❤️" : "🤍"}</span>
          <span>{likesCount}</span>
        </button>

        {/* Add to Playlist Button */}
        <button
          onClick={() => setShowAddToPlaylistModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-900/70 text-slate-200 border border-white/10 hover:bg-slate-800/70 transition-colors"
        >
          <span>📋</span>
          <span>Add to Playlist</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-900/70 text-slate-200 border border-white/10 hover:bg-slate-800/70 transition-colors"
        >
          <span>🔗</span>
          <span>Share</span>
        </button>

        {/* Comment Button (if you want to add comments later) */}
        <Link
          to={`/watch/${video._id}#comments`}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-900/70 text-slate-200 border border-white/10 hover:bg-slate-800/70 transition-colors"
        >
          <span>💬</span>
          <span>Comments</span>
        </Link>
      </div>

      {/* Add to Playlist Modal */}
      {showAddToPlaylistModal && (
        <AddToPlaylistModal
          videoId={video._id}
          onClose={() => setShowAddToPlaylistModal(false)}
        />
      )}
    </>
  )
}

export default VideoAction
