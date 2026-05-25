import { Link } from "react-router-dom"
import { Trash2 } from "lucide-react"
import Avatar from "../ui/Avatar"
import Glass from "../ui/Glass"
import type { Playlist } from "../../types"

interface PlaylistCardProps {
  playlist: Playlist
  onClick?: () => void
  onDelete?: () => void
}

const PlaylistCard = ({ playlist, onClick, onDelete }: PlaylistCardProps) => {
  const thumbnail = playlist.thumbnail || playlist.videos?.[0]?.thumbnail || "/default.png"
  const videoCount = playlist.videos?.length || 0
  const createdAtValue = playlist.createdAt ? new Date(playlist.createdAt) : null
  const createdDate = createdAtValue && !isNaN(createdAtValue.getTime())
    ? createdAtValue.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Unknown"
  const owner = typeof playlist.owner === 'object' && playlist.owner !== null
    ? playlist.owner
    : {
        username: "unknown",
        fullName: "Unknown",
        avatar: "/default.png"
      }

  return (
    <Glass
      onClick={onClick}
      className={`group transition-transform duration-200 hover:-translate-y-0.5 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <Link to={`/playlist/${playlist._id}`} className="relative overflow-hidden rounded-3xl bg-slate-900">
        <img
          src={thumbnail}
          alt={playlist.name}
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <p className="text-xs text-white/80">
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete playlist"
          >
            <Trash2 size={18} />
          </button>
        )}
      </Link>

      <div className="pt-4 flex flex-col gap-3">
        <Link to={`/playlist/${playlist._id}`} className="flex items-center justify-between gap-3">
          <h3 className="text-white text-lg font-semibold line-clamp-2">{playlist.name}</h3>
        </Link>

        <p className="text-sm text-zinc-400 line-clamp-2">{playlist.description}</p>

        <div className="flex items-center justify-between gap-3 text-xs text-zinc-500">
          <Link
            to={`/profile/${owner.username}`}
            className="flex items-center gap-2 text-zinc-300 hover:text-white"
          >
            <Avatar
              src={owner.avatar || "/default.png"}
              alt={owner.username}
              size="sm"
            />
            <span>{owner.fullName || owner.username}</span>
          </Link>
          <span>{createdDate}</span>
        </div>
      </div>
    </Glass>
  )
}

export default PlaylistCard
