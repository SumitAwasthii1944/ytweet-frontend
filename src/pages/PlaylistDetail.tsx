import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useAppDispatch from "../hooks/useAppDispatch"
import useAppSelector from "../hooks/useAppSelector"
import {
  fetchPlaylistById,
  deletePlaylistData,
  removeVideoFromPlaylistData
} from "../features/playlistSlice"
import { useAuth } from "../hooks/useAuth"
import EditPlaylistModal from "../components/playlist/EditPlaylistModal"
import Spinner from "../components/ui/Spinner"
import { ChevronLeft, Trash2, Edit2 } from "lucide-react"
import Glass from "../components/ui/Glass"

export default function PlaylistDetail() {
  const { playlistId } = useParams<string>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentPlaylist: playlist, loading, error } = useAppSelector(
    (state) => state.playlists
  )
  const [showEditModal, setShowEditModal] = useState(false)
  const isOwner = user?._id === playlist?.owner._id

  useEffect(() => {
    if (playlistId) {
      dispatch(fetchPlaylistById(playlistId) as any)
    }
  }, [dispatch, playlistId])

  const handleDeletePlaylist = async () => {
    if (!confirm("Are you sure you want to delete this playlist?")) return
    const result = await dispatch(deletePlaylistData(playlistId!) as any)
    if (result.type === deletePlaylistData.fulfilled.type) {
      navigate("/playlists")  // only navigate on success
    }
  }

  const handleRemoveVideo = async (videoId: string) => {
    if (!confirm("Remove this video from playlist?")) return
    dispatch(
      removeVideoFromPlaylistData({ videoId, playlistId: playlistId! }) as any
    )
    // no need to refetch — slice updates currentPlaylist automatically
  }

  if (loading) return <Spinner />

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Playlist not found</p>
          <button
            onClick={() => navigate("/playlists")}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    )
  }

  return (
    <Glass className="min-h-screen bg-black text-white">

      {/* Header */}
      <div className="flex items-center rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <button
          onClick={() => navigate("/playlists")}
          className="hover:bg-gray-900 p-2 rounded-full transition"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-gray-400 mt-1">{playlist.description}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>{playlist.videos.length} videos</span>
            <span>By {playlist.owner.fullName}</span>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="hover:bg-gray-900 p-2 rounded-full transition"
              title="Edit Playlist"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={handleDeletePlaylist}
              className="hover:bg-red-900/20 text-red-500 p-2 rounded-full transition"
              title="Delete Playlist"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-600 text-white p-4 m-6 rounded">
          {error}
        </div>
      )}

      {/* Videos List */}
      <div className="max-w-6xl mx-auto p-6">
        {playlist.videos.length > 0 ? (
          <div className="space-y-2">
            {playlist.videos.map((video, index) => (
              <div
                key={video._id}
                className="flex items-center gap-4 bg-gray-900 rounded p-3 hover:bg-gray-800 transition group"
              >
                <span className="text-gray-400 font-semibold w-8">{index + 1}</span>

                <div
                  onClick={() => navigate(`/watch/${video._id}`)}
                  className="cursor-pointer flex-shrink-0"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                </div>

                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/watch/${video._id}`)}
                >
                  <h3 className="font-semibold hover:text-gray-300 transition line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400">{video.owner.fullName}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>{video.views} views</span>
                    <span>
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {isOwner && (
                  <button
                    onClick={() => handleRemoveVideo(video._id)}
                    disabled={loading}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 disabled:opacity-30 transition p-2"
                    title="Remove from Playlist"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos in this playlist yet</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && isOwner && (
        <EditPlaylistModal
          playlist={playlist}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </Glass>
  )
}