import { Link } from "react-router-dom"
import Avatar from "../ui/Avatar"
import type { Video } from "../../types"
import { useLocation } from "react-router-dom"
import Button from "../ui/Button"
import { useVideos } from "../../hooks/useVideos"
import { useState } from "react"
import useAppDispatch from "../../hooks/useAppDispatch"
import { showToast } from "../../features/uiSlice"


interface VideoCardProps {
  video: Video
  onDelete?: (id: string) => void 
  onEdit?: (id:string) => void
  onPublish?: (id:string) => void
}

const VideoCard = ({ video, onDelete }: VideoCardProps) => {
  const { deleteVideo, toggleVideoPublish } = useVideos()
  const [deleting, setDeleting] = useState(false)
  const [publish, setPublish] = useState<boolean>(video.isPublished)
  const location = useLocation()
  const isDashboard = location.pathname.startsWith("/dashboard")
  const dispatch = useAppDispatch()

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const formatViews = (views: number) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`
    return views
  }

  const formattedDate = new Date(video.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

  const handlePublish = async () => {
    try {
      await toggleVideoPublish(video._id)
      setPublish(!publish)
    } catch(err) {
      console.log(err);
      
    } 
    
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteVideo(video._id)
      onDelete?.(video._id)  // tell parent to remove this card instantly
      dispatch(showToast({ type: "success", message: "Video deleted" }))
    } catch {
      setDeleting(false)  // revert spinner if deletion failed
      dispatch(showToast({ type: "error", message: "Failed to delete video" }))
    }
  }

  return (
    <div className="w-full flex flex-col gap-3 p-2 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/20 transition-transform duration-300 hover:-translate-y-0.5">

      <Link to={`/watch/${video._id}`} className="relative block overflow-hidden group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {formatDuration(video.duration)}
        </span>
      </Link>

      {isDashboard && (
        <div className="bg-gray-900 p-1 rounded-xl flex justify-between">
          <Button className="md:w-18"><p className="text-[12px] md:text-[20px] ">Edit</p></Button>
          {/* visibility toggle */}
          <div className="flex items-center justify-between px-1 md:px-4 md:py-3 py-0.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex flex-col">
                  <span className="text-white text-[10px] md:text-[18px] mr-1 font-medium">
                      {publish ? "Public" : "Private"}
                  </span>
                  
              </div>
              {/* Toggle switch */}
              <button
                  type="button"
                  onClick={handlePublish}
                  className={`relative md:w-11 w-8 h-4 md:h-6 rounded-full transition-colors duration-300
                      ${publish ? "bg-violet-500" : "bg-zinc-600"}`}
              >
                  <span className={`absolute top-0.5 left-0.5 md:w-5 md:h-5 w-3 h-3 bg-white rounded-full shadow
                      transition-transform duration-300
                      ${publish ? "translate-x-4 md:translate-x-5" : "translate-x-0"}`}
                  />
              </button>
          </div>
          {deleting ? (
            <span className="text-xs text-red-400 flex items-center px-2">Deleting...</span>
          ) : (
            <Button onClick={handleDelete}><p className="text-[12px] md:text-[20px] ">Delete</p></Button>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Link to={`/profile/${video.owner?.username}`}>
          <Avatar
            src={video.owner?.avatar || "/default.png"}
            alt={video.owner?.username || "user"}
            size="md"
          />
        </Link>
        <div className="flex flex-col flex-1">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-white text-sm font-semibold line-clamp-2 hover:text-violet-400">
              {video.title}
            </h3>
          </Link>
          <Link to={`/profile/${video.owner?.username}`} className="text-zinc-400 text-xs hover:text-white">
            {video.owner?.fullName || "Unknown"}
          </Link>
          <span className="text-zinc-500 text-xs">
            {formatViews(video.views || 0)} views • {formattedDate}
          </span>
        </div>
      </div>

    </div>
  )
}

export default VideoCard